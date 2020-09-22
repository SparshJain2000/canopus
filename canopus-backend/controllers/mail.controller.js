require("dotenv").config();
const mailgun = require("mailgun-js");
const DOMAIN = "curoid.co";
const api=process.env.MG_API;
const ADMIN_MAIL="noreply@curiod.co";
const mg = mailgun({apiKey: api, domain: DOMAIN,host: "api.eu.mailgun.net"});
const mailController={}
async function forgotMail(req,user,token){
    
    const data = {
        from: ADMIN_MAIL,
        to: "tmsusha@gmail.com",
        subject: "Reset your Password",
        template: "forgot_password",
        'h:X-Mailgun-Variables': JSON.stringify({
            test:`https://${req.headers.host}/reset`,
           
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

}

async function welcomeMail(req,user){

    return true;
}

async function jobPostMail(req,job,employer){

}

exports.mailController={forgotMail};
