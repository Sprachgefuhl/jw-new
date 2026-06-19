const crypto = require('crypto');

function hash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

function getRandomEmailAddress() {
  const emails = [
    "malware@company.com",
    "readtheroom@divinia.org",
    "cheapcreamsandoinments@yahoo.com",
    "dontvisitourcountry@djibouti.org",
    "nigerianprince1000@outlook.com"
  ];

  return emails[Math.floor(Math.random() * emails.length)];
}

module.exports = { hash, generateToken, getRandomEmailAddress };