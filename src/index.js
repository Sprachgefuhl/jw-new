require('dotenv').config();
const { getState, updateState } = require('./services/state');
const scrapeSite = require('./services/scraper');

async function runCheck() {
	const oldState = await getState();
	const currentState = await scrapeSite();
	
	if (currentState !== oldState.hash) { // if new contect detected
		const updated = await updateState(currentState);
		console.log(updated);
		// notify emails
	}
}