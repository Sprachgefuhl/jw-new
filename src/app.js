require('dotenv').config();
const express = require('express');
const path = require('path');
const validator = require('validator');
const app = express();
const { runScraper } = require('./services/scraper');
const { getState, updateState } = require('./services/state');
const { getSubByEmail, createSub, deleteSub, updateUserLang, getAllSubs } = require('./services/user');
const { getRandomEmailAddress, timeSinceLastContent } = require('./utils');
const langData = require('./langData');
const { notifySubs } = require('./services/notify');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
	const timeSince = await timeSinceLastContent();
	res.render('index', { status: timeSince });
});

app.post('/subscribe', async (req, res) => {
	const formEmail = req.body.email.toLowerCase().trim();
	// const formLang = req.body.lang;
	const formLang = 'E'; // english by default, change when reintegrating mls
	const email = await getSubByEmail(formEmail);

	if (!validator.isEmail(formEmail)) return res.status(400).json({ success: false, msg: 'Invalid email' }); // invalid email
	if (email) return res.status(409).json({ success: false, msg: 'Already subscribed' }); // already subscribed

	const newSub = await createSub(formEmail, formLang);
	return res.status(200).json({ success: true, msg: 'Subscribed' });
});

app.get('/unsubscribe', async (req, res) => {
	const { token } = req.query;

  if (!token) return res.status(401).json({ success: false, msg: 'Unauthorised' }); // missing tolen

  const deleted = await deleteSub(token);
  if (!deleted) { return res.status(400).json({ success: false, status: 'Email not found' })}; // invalid token

	return res.render('index', { status: 'Unsubscribed' });
});

app.get('/api', async (req, res) => {
	// block users without key
	const apiKey = req.query.key;
	if (!apiKey || apiKey !== process.env.SCRAPER_KEY) return res.status(401).json({ error: 'unauthorized' });

	await runScrapers();
	return res.status(200).json({ success: true });
});

app.get('/health', async (req, res) => {
	// block users without key
	const apiKey = req.query.key;
	if (!apiKey || apiKey !== process.env.SCRAPER_KEY) return res.status(401).json({ error: 'unauthorized' });
	return res.status(200).json({ success: true });
});

async function runScrapers() {
	// for (const lang of langData) { // execute scaper for each language
	// 	await runScraper(lang);
	// }

	await runScraper(langData[0])
}

app.listen(process.env.PORT || 3000);