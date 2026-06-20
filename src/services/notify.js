const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API);

async function notifySubs(subs, articles, videos) {
  try {
    const emailPayloads = subs.map(sub => ({
      from: 'admin@avreminder.xyz',
      to: [sub.email],
      subject: 'New content on jw.org',
      html: `
      <div style="font-family: Trebuchet MS; font-size: 18px;">
        ${(() => {
          if (!videos.length) return '';
          let videoEl = '<h2 style="padding: 10px; background: #e5e7eb; color: #1e293b; border-radius: 10px; text-align: center; width: 100px; font-size: 24px;">VIDEOS</h2>';
          videos.forEach(video => {
            videoEl += `<p>${video}</p>`;
          });
          return videoEl;
        })()}
        <br>
        ${(() => {
          if (!articles.length) return '';
          let articleEl = '<h2 style="padding: 10px; background: #e5e7eb; color: #1e293b; border-radius: 10px; text-align: center; width: 125px; font-size: 24px;">ARTICLES</h2>';
          articles.forEach(article => {
            articleEl += `<p>${article}</p>`;
          });
          return articleEl;
        })()}
        <br><br>
        <a style="color: #F08000; text-decoration: none;" href="https://jw-new.onrender.com/unsubscribe?token=${sub.unsubscribe_token}">unsubscribe 🥹</a>
      </div>
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