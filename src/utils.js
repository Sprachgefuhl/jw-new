const crypto = require('crypto');
const { getLastUpdated } = require('./services/state');

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getRandomEmailAddress() {
  const emails = [
    // "malware@company.com",
    // "readtheroom@divinia.com",
    // "cheapcreamsandoinments@yahoo.com",
    // "dontvisitourcountry@djibouti.gov",
    "Email",
  ];

  return emails[Math.floor(Math.random() * emails.length)];
}

async function timeSinceLastContent() {
  const lastUpdated = await getLastUpdated();
  const msSince = new Date() - new Date(lastUpdated);
  const hrsSince = msSince / (1000 * 60 * 60);
  
  if (hrsSince < 1) {
    const mins = Math.floor(hrsSince * 60);
    return `${mins} min${mins !== 1 ? 's' : ''} ago`;
  } else if (hrsSince < 24) {
    const hours = Math.floor(hrsSince);
    return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(hrsSince / 24);
    return `${days} day${days !== 1 ? 's' : ''} ago`;
  }
}

module.exports = { hash, generateToken, getRandomEmailAddress, timeSinceLastContent };