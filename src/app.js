require('dotenv').config();
const express = require('express');
const path = require("path");
const validator = require('validator');
const { getState, updateState } = require('./services/state');
const scrapeSite = require('./services/scraper');
const notifySubs = require('./services/notify');
const { getSubscriberByEmail, createSubscriber, deleteSubscriber, getAllSubscribers } = require('./services/subscribe');
const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
	// const subs = await getAllSubscribers();
	// await notifySubs(subs);
	res.render('index');
});

app.get('/api', async (req, res) => {
	// block users without key
	const apiKey = req.query.key;
	if (!apiKey || apiKey !== process.env.SCRAPER_KEY) return res.status(401).json({ error: 'unauthorized' });

	await runCheck();
	return res.status(200).json({ success: true });
});

app.get('/unsubscribe', async (req, res) => {
	const { token } = req.query;

  if (!token) {
		return res.json({ status: 'Invalid request' });
  }

  const deleted = await deleteSubscriber(token);
	console.log(deleted);

  if (!deleted) { // invalid token
		return res.json({ status: 'Email not found' });
  }

	return res.json({ status: 'Successfully unsubscribed' });
});

app.post('/subscribe', async (req, res) => {
	const formEmail = (req.body.email).toLowerCase().trim();
	const email = await getSubscriberByEmail(formEmail);

	if (!validator.isEmail(formEmail)) return res.json({ status: 'Invalid email' });
	if (!formEmail) return res.json({ status: 'Must provide email' });
	if (email) return res.json({ status: 'Already subscribed', email: email.email });
	await createSubscriber(formEmail);
	return res.json({ status: 'Successfully subscribed' });
});

app.get('/health', (req, res) => {
	// block users without key
	const apiKey = req.query.key;
	if (!apiKey || apiKey !== process.env.SCRAPER_KEY) return res.status(401).json({ error: 'unauthorized' });

	return res.json({ apiStatus: 'Healthy' });
});

async function runCheck() {
	const oldState = await getState();
	const currentState = await scrapeSite();
	
	if (currentState !== oldState.hash) { // if new contect detected
		const updated = await updateState(currentState);
		const allSubscribers = await getAllSubscribers();
		await notifySubs(allSubscribers);
	}
}

app.listen(process.env.PORT || 3000);