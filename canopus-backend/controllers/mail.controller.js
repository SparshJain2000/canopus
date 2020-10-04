require("dotenv").config();
const mailgun = require("mailgun-js");
const DOMAIN = "curoid.co";
const api=process.env.MG_API;
const mg = mailgun({apiKey: api, domain: DOMAIN});
const mailController={}
async function forgotMailUser(req,user,token){
    
    const data = {
        from: 'Curoid.co <no-reply@curoid.co>',
        to: req.body.username,
        subject: "Reset your Password",
        template: "forgot_password",
        'h:X-Mailgun-Variables': JSON.stringify({
            test:`http://${req.headers.host}/user/forgot/${token}`,
          })
    };
    mg.messages().send(data, function (error, body) {
    
            if(error)
            return error;
            else
            return body;
        })
}
async function forgotMailEmployer(req,user,token){
    
    const data = {
        from: 'Curoid.co <no-reply@curoid.co>',
        to: req.body.username,
        subject: "Reset your Password",
        template: "forgot_password",
        'h:X-Mailgun-Variables': JSON.stringify({
            test:`http://${req.headers.host}/employer/forgot/${token}`,
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
async function validateMailUser(req,user,token){
    const data = {
        from: 'Curoid.co <no-reply@curoid.co>',
        to: req.body.username,
        subject: "Validate your email",
        template: "forgot_password",
        'h:X-Mailgun-Variables': JSON.stringify({
            test:`http://${req.headers.host}/user/validate/${token}`,
          })
    };
    mg.messages().send(data, function (error, body) {
    
            if(error)
            return error;
            else
            return body;
        })
}

async function validateMailEmployer(req,user,token){
    const data = {
        from: 'Curoid.co <no-reply@curoid.co>',
        to: req.body.username,
        subject: "Validate your email",
        template: "forgot_password",
        'h:X-Mailgun-Variables': JSON.stringify({
            test:`http://${req.headers.host}/employer/validate/${token}`,
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

async function attachedApplicantMail(req,job,employer,attachedApplicants){
    
}

exports.mailController={forgotMailUser,forgotMailEmployer,welcomeMail,validateMailUser,validateMailEmployer};
