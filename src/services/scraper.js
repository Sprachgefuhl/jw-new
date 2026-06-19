const axios = require('axios');
const cheerio = require('cheerio');
const { hash } = require('../utils');

async function extractArticles() {
  const res = await axios.get('https://www.jw.org/en/whats-new/');
  const html = res.data;
  const $ = cheerio.load(html);
  const articleTitles = $('.whatsNewItems .syn-body a').text();

  return articleTitles.replace(/\s+/g, ' ').trim();
}

async function extractVideos() {
  const res = await axios.get('https://b.jw-cdn.org/apis/mediator/v1/categories/E/LatestVideos'); // videos api endpoint
  const videos = res.data.category.media;
  const titles = videos.map(video => video.title);

  return titles.join('');
}

async function scrapeSite() {
	const articles = await extractArticles();
	const videos = await extractVideos();
	return hash(articles + videos);
}

scrapeSite();

module.exports = { scrapeSite };