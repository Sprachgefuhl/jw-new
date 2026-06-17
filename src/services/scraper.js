const axios = require('axios');
const cheerio = require('cheerio');
const crypto = require('crypto');

async function extractArticles() {
  const res = await axios.get('https://www.jw.org/en/whats-new/');
  const html = res.data;
  
  const $ = cheerio.load(html);
  return $('.whatsNewItems').text().replace(/\s+/g, ' ').trim(); // article content as text
}

async function extractVideos() {
  const res = await axios.get('https://b.jw-cdn.org/apis/mediator/v1/categories/E/LatestVideos'); // videos api endpoint
  return JSON.stringify(res.data.category.media); // list of videos
}

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

async function scrapeSite() {
	const articles = await extractArticles();
	const videos = await extractVideos();
	return hash(articles + videos);
}

module.exports = scrapeSite;