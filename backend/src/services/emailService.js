require('dotenv').config();
const nodeMailer = require('nodemailer');
const transporter = nodeMailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})
async function sendEmail(to, subject, text) {
    const mailOptions = {
        from: `"AI Resume Analyser"<${process.env.EMAIL_FROM}>`,
        to: to,
        subject: subject,
        text: text
    };
    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        console.error(`Error sending email to ${to}: `, error);
        throw error;
    }
}
module.exports = { sendEmail };
