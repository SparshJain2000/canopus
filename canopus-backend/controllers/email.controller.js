const DOMAIN = 'sandboxa6c1b3d7a13a4122aaa846d7cd3f96a2.mailgun.org';
var api_key=process.env.MG_API;
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
exports.transport=transport;