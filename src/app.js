require('dotenv').config();
const express = require('express');
const path = require("path");
const validator = require('validator');
const app = express();
const { scrapeSite } = require('./services/scraper');
const { getState, updateState } = require('./services/state');
const { getSubByEmail, createSub, deleteSub, getAllSubs } = require('./services/subscribe');
const { notifySubs } = require('./services/notify');
const { getRandomEmailAddress, timeSinceLastContent } = require('./utils');
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', async (req, res) => {
	const timeSince = await timeSinceLastContent();
	res.render('index', { status: 'Last detected content: ', timeSince: timeSince, colour: '', emailPlaceholder: getRandomEmailAddress() });
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

app.post('/subscribe', async (req, res) => {
	const formEmail = req.body.email.toLowerCase().trim();
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
		return res.render('index', {
			status: 'Already subscribed!',
			colour: '#F08000',
			timeSince: '',
			emailPlaceholder: getRandomEmailAddress()
		});	
	}

	const newSub = await createSub(formEmail);
	return res.render('index', { status: 'Subscribed!', timeSince: '', colour: '#80EF80', emailPlaceholder: getRandomEmailAddress() });
});

app.get('/api', async (req, res) => {
	// block users without key
	const apiKey = req.query.key;
	if (!apiKey || apiKey !== process.env.SCRAPER_KEY) return res.status(401).json({ error: 'unauthorized' });

	await runCheck();
	return res.status(200).json({ success: true });
});

app.get('/health', (req, res) => {
	// block users without key
	const apiKey = req.query.key;
	if (!apiKey || apiKey !== process.env.SCRAPER_KEY) return res.status(401).json({ error: 'unauthorized' });

	return res.json({ apiStatus: 'Healthy' });
});

async function runCheck() {
	console.log('🌐 Scraper running...');
	const oldContent = await getState();
	const currentContent = await scrapeSite();
	const newArticles = currentContent.articles.filter(article => !oldContent.articles.includes(article));
	const newVideos = currentContent.videos.filter(video => !oldContent.videos.includes(video));

	if (newArticles.length || newVideos.length) { // new content found
		console.log('✅ New content detected!');
		await updateState(currentContent);
		const allSubscribers = await getAllSubs(); // fetch subs
		return await notifySubs(allSubscribers, newArticles, newVideos); // notify them
	}
}

app.listen(process.env.PORT || 3000);