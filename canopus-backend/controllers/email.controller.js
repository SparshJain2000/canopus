require("dotenv").config();
const api_key=process.env.MG_API;
const ADMIN_MAIL=process.env.ADMIN_MAIL;
const smtp_pass=process.env.MG_SMTP_PASSWORD;
//console.log(smtp_pass);
// var mailgun = require('mailgun-js') 
//     ({apiKey: api_key, domain: DOMAIN}); 
var nodemailer=require('nodemailer');
    var transport = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
           user: ADMIN_MAIL,
           pass: smtp_pass
        }
    });
    //Verifying the Nodemailer Transport instance
transport.verify((error, success) => {
    if (error) {
      console.log(error);
    } else {
      console.log('Server is ready to take messages');
    }
  });
exports.transport=transport;