require('dotenv').config();
const express = require('express');
const { getState, updateState } = require('./services/state');
const scrapeSite = require('./services/scraper');
const notifyUsers = require('./services/notify');
const app = express();

app.get('/run-check', async (req, res) => {
	const result = await runCheck();
	res.send(result);
});

app.get('/', (req, res) => {
  res.send('OK');
});

async function runCheck() {
	const oldState = await getState();
	const currentState = await scrapeSite();
	
	if (currentState !== oldState.hash) { // if new contect detected
		const updated = await updateState(currentState);
		await notifyUsers(['benjsbroja@gmail.com']);
		return 'New content detected - users notified';
	} else {
		return 'Nothing new';
	}
}

app.listen(process.env.PORT || 3000);