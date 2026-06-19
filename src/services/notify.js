const { Resend } = require('resend');
const resend = new Resend(process.env.RESEND_API);

async function notifySubs(subs, articles, videos) {
  try {
    const emailPayloads = subs.map(sub => ({
      from: 'admin@avreminder.xyz',
      to: [sub.email],
      subject: 'New content on jw.org',
      html: `<h2><a style="color: #F08000; text-decoration: none;" href="https://www.jw.org/en/whats-new/">What's new? 👈🌐</a></h2>
      ${(() => {
        if (!videos.length) return;
        let videoEl = '';
        videos.forEach(video => {
          videoEl += `<p style="font-weight: bold;">VIDEO</p> <span>${video}</span><br><br>`;
        });
        return videoEl;
      })()}
      ${(() => {
        if (!articles.length) return;
        let articleEl = '';
        articles.forEach(article => {
          articleEl += `<p style="font-weight: bold;">ARTICLE</p> <span>${article}</span><br><br>`;
        });
        return articleEl;
      })()}
      <br><br>
      <a style="color: #F08000; text-decoration: none;" href="https://jw-new.onrender.com/unsubscribe?token=${sub.unsubscribe_token}">unsubscribe 🥹</a>`
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