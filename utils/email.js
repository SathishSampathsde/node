const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, message, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const email = {
    from: "Sathish Sampath <sathish@gmail.com>",
    to: to,
    subject: subject,
    text: message,
    html: html,
  };

  await transporter.sendMail(email);
};

module.exports = sendEmail;
