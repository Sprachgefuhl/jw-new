const nodemailer = require('nodemailer');

async function notifySubs(subs) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100
  });

  for (const sub of subs) {
    const unsubscribeURL = `https://jw-new.onrender.com/unsubscribe?token=${sub.unsubscribe_token}`;

    await transporter.sendMail({
      to: sub.email,
      subject: 'New JW Content!',
      html: `
        <h2><a href="https://www.jw.org/en/whats-new/">What's New?</a></h2>
        <br>
        <a href="${unsubscribeURL}">Unsubscribe</a>
      `
    });
  }
}

module.exports = notifySubs;