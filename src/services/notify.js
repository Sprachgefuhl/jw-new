const { Resend } = require('resend');
const handlebars = require('handlebars');
const mjml = require('mjml');
const fs = require('fs');
const path = require('path');

const templatePath = path.join(process.cwd(), 'src/templates/email.mjml');
const mjmlTemplate = fs.readFileSync(templatePath, 'utf8');
const compiledTemplate = handlebars.compile(mjmlTemplate);
const resend = new Resend(process.env.RESEND_API);

async function generateHtmlEmail(data) {
  const mjmlOutput = compiledTemplate(data);
  const result = await mjml(mjmlOutput, {
    minify: true,
    validationLevel: 'soft',
    keepComments: false
  });

  return result.html
}

async function notifySubs(subs, articles, videos) {
  try {
    let emailPayloads = [];
    for (const sub of subs) {
      const html = await generateHtmlEmail({ unsubscribeToken: sub.unsubscribe_token, articles: articles, videos: videos }); 
      emailPayloads.push({
        from: 'admin@avreminder.xyz',
        to: [sub.email],
        subject: 'New content on jw.org',
        html: html
      });
    }

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