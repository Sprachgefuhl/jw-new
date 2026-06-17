const nodemailer = require('nodemailer');

async function notifyUsers(users) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const usersEmails = users.join(',');

  const mailOptions = {
    from: 'JW New',
    to: usersEmails,
    subject: 'New content on JW.org!',
    text: 'https://www.jw.org/en/whats-new/',
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Emails sent:' ${info.response}`);
    return info;
  } catch (error) {
    console.error(`Error sending emails: ${error}`);
    throw error;
  }
}

module.exports = notifyUsers;