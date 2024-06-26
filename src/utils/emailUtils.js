const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp-relay.sendinblue.com',
  port: 587,
  auth: {
    user: process.env.smptuser,
    pass: process.env.smtppass,
  }
});

const sendEmail = async (to, subject, html) => {
    console.log("inside the sendEmail method  with value ")
    console.log(`to ${to} , subject: ${subject}, html: ${html}`)
  const mailOptions = {
    from: 'Keyut Shah <shahkeyut@gmail>',
    to,
    subject,
    html
  };

  return transporter.sendMail(mailOptions);
};

module.exports = {
  sendEmail
};
