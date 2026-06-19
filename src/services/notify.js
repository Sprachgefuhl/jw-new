const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API);

async function notifySubs(subs) {
  try {
    const emailPayloads = subs.map(sub => ({
      from: 'admin@avreminder.xyz',
      to: [sub.email],
      subject: 'JW.org has released content',
      html: `
      <a href="https://www.jw.org/en/whats-new/">Take me to jw.org! 😁</a><br><br>
      <a href="https://jw-new.onrender.com/unsubscribe?token=${sub.unsubscribe_token}">unsubscribe 🥹</a>
      `
    }));

    const { data, error } = await resend.batch.send(emailPayloads);

    if (error) {
      console.error('❌ Resend API error:', error);
      return { success: false, error };
    }

    console.log(`✅ Successfully sent ${data.data.length} emails`);
    return { success: true };
  } catch (err) {
    console.error('❌ Failed to send emails: ', err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { notifySubs };