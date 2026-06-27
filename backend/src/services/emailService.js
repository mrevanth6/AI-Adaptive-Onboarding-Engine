require('dotenv').config();
const { BrevoClient } = require('@getbrevo/brevo');
const brevo = new BrevoClient({
    apiKey: process.env.BREVO_API_KEY
});
// const transporter = nodeMailer.createTransport({
//     host: process.env.SMTP_HOST,
//     port: Number(process.env.SMTP_PORT),
//     secure: false,
//     auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS
//     }
// })
async function sendEmail(to, subject, text) {
    // const mailOptions = {
    //     from: `"AI Resume Analyser"<${process.env.EMAIL_FROM}>`,
    //     to: to,
    //     subject: subject,
    //     text: text
    // };
    const mailOptions = {
        sender: { email: process.env.EMAIL_FROM, name: "AI Resume Analyser" },
        to: [{ email: to }],
        subject: subject,
        textContent: text
    }
    try {
        await brevo.transactionalEmails.sendTransacEmail(mailOptions);
    } catch (error) {
        console.error(`Error sending email to ${to}: `, error);
        throw error;
    }
}
module.exports = { sendEmail };
