const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const OAuth2 = google.auth.OAuth2;

const {
  clientId,
  clientSecret,
  refreshToken,
  user,
  email: {
    from,
    to,
    cc,
    bcc,
    subject,
    message,
  }
} = require('./config');

const oauth2Client = new OAuth2(
  clientId,
  clientSecret,
  refreshToken,
);

oauth2Client.setCredentials({
  refresh_token: refreshToken,
});
const accessToken = oauth2Client.getAccessToken();

const smtpTransport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user,
    clientId: clientId,
    clientSecret: clientSecret,
    refreshToken: refreshToken,
    accessToken: accessToken
  }});

const mailOptions = {
  from,
  to,
  bcc,
  subject,
  generateTextFromHTML: true,
  html: message,
};

smtpTransport.sendMail(mailOptions, (error, response) => {
  if (error) {
    console.log(error)
  } else {
    console.log('Success');
    console.log(response);
  }
  smtpTransport.close();

  process.exit();
});