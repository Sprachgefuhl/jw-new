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

async function hrsSinceLastContent() {
  const lastUpdated = await getLastUpdated();
  const msSince = new Date() - new Date(lastUpdated);
  const hrsSince = msSince / (1000 * 60 * 60);
  
  return hrsSince;
}

async function timeSinceLastContent() {
  const hrsSince = await hrsSinceLastContent();
  
  if (hrsSince < 1) {
    const mins = Math.floor(hrsSince * 60);
    return `${mins}m ago`;
  } else if (hrsSince < 24) {
    const hours = Math.floor(hrsSince);
    return `${hours}hr${hours !== 1 ? 's' : ''} ago`;
  } else {
    const days = Math.floor(hrsSince / 24);
    return `${days}d ago`;
  }
}

module.exports = { hash, generateToken, getRandomEmailAddress, timeSinceLastContent, hrsSinceLastContent };