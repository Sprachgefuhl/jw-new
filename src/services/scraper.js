const axios = require('axios');
const cheerio = require('cheerio');
const { getState } = require('./state');
const { getAllSubs } = require('./user');
const { notifySubs } = require('./notify');
const langData = require('../langData');

async function scrapeArticles(lang) {
  // const res = await axios.get(lang.scraperUrl);
  const res = await axios.get('https://www.jw.org/en/news/region/global/Door-to-Door-Preaching-Constitutes-for-Jehovahs-Witnesses-an-Essential-Manifestation-of-Their-Religion/');
  const html = res.data;
  const $ = cheerio.load(html);
  const articleTitles = $('.whatsNewItems .syn-body a').map((i, article) => $(article).text().trim()).get();

  return articleTitles;
}

async function scrapeVideos(lang) {
  const res = await axios.get(`https://b.jw-cdn.org/apis/mediator/v1/categories/${lang.ref}/LatestVideos`); // videos api endpoint
  const videos = res.data.category.media;
  let data = [];
  videos.forEach(video => {
    data.push(
      { title: video.title, image: video.images.lsr.xl }
    );
  });

  return data;
}

async function runScraper(lang) {
  console.log(`🌐 Scraper running for: ${lang.name}`);
  
  const oldContent = await getState(lang.ref);
  const currentArticles = await scrapeArticles(lang);
  const currentVideos = await scrapeVideos(lang);
  const newArticles = currentArticles.filter(article => !oldContent.articles.includes(article));
  const newVideos = currentVideos.filter(current => !oldContent.videos.some(old => old.title === current.title));

  if (newArticles.length || newVideos.length) { // new content found in language
  	console.log(`✅ New content detected: ${lang.name}`);
  	await updateState(currentArticles, currentVideos, lang.ref);
  	const allSubscribers = await getAllSubs();
    const subsInLang = allSubscribers.filter(sub => sub.lang === lang.ref);
  	return await notifySubs(subsInLang, newArticles, newVideos);
  }
}

module.exports = { runScraper };