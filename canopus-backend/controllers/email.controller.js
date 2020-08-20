
const DOMAIN = 'sandboxa6c1b3d7a13a4122aaa846d7cd3f96a2.mailgun.org';
var api_key='fa93abf5a3a7c28949f4ef0d5c0bdffd-203ef6d0-1d6dfd82';
// var mailgun = require('mailgun-js') 
//     ({apiKey: api_key, domain: DOMAIN}); 
var nodemailer=require('nodemailer');

    var transport = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
           user: 'postmaster@sandboxa6c1b3d7a13a4122aaa846d7cd3f96a2.mailgun.org',
           pass: '1a035b828dcb6068cc12d40f82b14ef3-203ef6d0-de8b198c'
        }
    });
exports.transport=transport;