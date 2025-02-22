//backend/testSendGrid.js:

require('dotenv').config();
console.log("SENDGRID_API_KEY:", process.env.SENDGRID_API_KEY);


const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const msg = {
  to: 'ktmrgn.echo@gmail.com', // Change to your recipient's email address
  from: 'kevin.morgan@echo-financial-advisors.co.nz', // Change to your verified sender
  subject: 'Sending with SendGrid is Fun',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
};

sgMail
  .send(msg)
  .then(() => {
    console.log('Email sent');
  })
  .catch((error) => {
    console.error(error);
  });
