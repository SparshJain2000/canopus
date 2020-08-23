const DOMAIN = 'sandboxa6c1b3d7a13a4122aaa846d7cd3f96a2.mailgun.org';
var api_key=process.env.MG_API;
require("dotenv").config();
// var mailgun = require('mailgun-js') 
//     ({apiKey: api_key, domain: DOMAIN}); 
var nodemailer=require('nodemailer');
    var transport = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
           user: process.env.ADMIN_MAIL,
           pass: process.env.MG_SMTP_PASSWORD
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