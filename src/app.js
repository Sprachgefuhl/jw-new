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
	res.render('index', { status: 'Last detected content: ', timeSince: timeSince, colour: '', emailPlaceholder: getRandomEmailAddress() });
});

app.post('/subscribe', async (req, res) => {
	const formEmail = req.body.email.toLowerCase().trim();
	const formLang = req.body.lang;
	const email = await getSubByEmail(formEmail);

	if (!validator.isEmail(formEmail)) {
		return res.render('index', {
			status: 'Invalid email',
			colour: 'rgb(255, 64, 64)',
			timeSince: '',
			emailPlaceholder: getRandomEmailAddress()
		});
	}

	if (email) {
		await updateUserLang(email.email, formLang);
		return res.render('index', {
			status: 'Language updated!',
			colour: '#F08000',
			timeSince: '',
			emailPlaceholder: getRandomEmailAddress()
		});	
	}

	const newSub = await createSub(formEmail, formLang);
	return res.render('index', { status: 'Subscribed!', timeSince: '', colour: '#80EF80', emailPlaceholder: getRandomEmailAddress() });
});

app.get('/unsubscribe', async (req, res) => {
	const { token } = req.query;

  if (!token) {
		return res.json({
			status: 'Invalid request',
			emailPlaceholder: getRandomEmailAddress()
		});
	};

  const deleted = await deleteSub(token);
  if (!deleted) { return res.json({ status: 'Email not found', emailPlaceholder: getRandomEmailAddress() })}; // invalid token

	return res.render('index', { status: 'Successfully unsubscribed', timeSince: '', colour: '#80EF80', emailPlaceholder: getRandomEmailAddress() });
});

app.get('/api', async (req, res) => {
	// block users without key
	const apiKey = req.query.key;
	if (!apiKey || apiKey !== process.env.SCRAPER_KEY) return res.status(401).json({ error: 'unauthorized' });

	await runCheck();
	return res.status(200).json({ success: true });
});

async function runScrapers() {
	for (const lang of langData) { // execute scaper for each language
		await runScraper(lang);
	}
}

app.listen(process.env.PORT || 3000);