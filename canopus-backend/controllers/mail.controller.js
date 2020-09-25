require("dotenv").config();
const mailgun = require("mailgun-js");
const DOMAIN = "curoid.co";
const api=process.env.MG_API;
const mg = mailgun({apiKey: api, domain: DOMAIN,host: "api.eu.mailgun.net"});
const mailController={}
async function forgotMail(req,user,token){
    
    const data = {
        from: 'Curoid.co <no-reply@curoid.co>',
        to: req.body.username,
        subject: "Reset your Password",
        template: "forgot_password",
        'h:X-Mailgun-Variables': JSON.stringify({
            test:`http://${req.headers.host}/forgot/${token}`,
          })
    };
    mg.messages().send(data, function (error, body) {
    
            if(error)
            return error;
            else
            return body;
        })
}
async function successfulResetMail(req,user){
    
}
async function validateMail(req,user,token){
    const data = {
        from: 'Curoid.co <no-reply@curoid.co>',
        to: req.body.username,
        subject: "Validate your email",
        template: "forgot_password",
        'h:X-Mailgun-Variables': JSON.stringify({
            test:`http://${req.headers.host}/validate/${token}`,
          })
    };
    mg.messages().send(data, function (error, body) {
    
            if(error)
            return error;
            else
            return body;
        })
}


async function welcomeMail(req,user){
    const data = {
        from: 'Curoid.co <no-reply@curoid.co>',
        to: req.body.username,
        subject: "Welcome",
        template: "welcome",
        'h:X-Mailgun-Variables': JSON.stringify({
           first_name:"Sushant"
           
          })
    };
    mg.messages().send(data, function (error, body) {
    
            if(error)
            return error;
            else
            return body;
        })
}

async function jobPostMail(req,job,employer){

}

exports.mailController={forgotMail,welcomeMail,validateMail};
