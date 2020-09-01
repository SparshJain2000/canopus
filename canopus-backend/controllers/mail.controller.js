require("dotenv").config();
const ADMIN_MAIL=process.env.ADMIN_MAIL;
const smtp_pass=process.env.MG_SMTP_PASSWORD;
const nodemailer=require('nodemailer');
const Email=require('email-templates');
const path=require('path');

let transporter = nodemailer.createTransport({
        host: 'smtp.mailgun.org',
        port: 587,
        auth: {
           user: ADMIN_MAIL,
           pass: smtp_pass
        }
    });

transporter.verify().then((success)=>{
      console.log("Server is ready to send messages");
    }).catch((err)=>console.log(err));  
    
 const email = new Email({
      views: {root:'./canopus-backend/', options: { extension: 'ejs' } },
      message: {
      from: ADMIN_MAIL,	
      // attachments:
      // [{
      //   filename:'hello.txt',
      //   path:'./server/files/hello.txt',
      //   contentType:'text/plain'
      // },
      // {
      //   filename:'sample.txt',
      //   content:'sample attachement - content',
      //   contentType:'text/plain'
      // }]
      },
      preview:false,
      send: true,
      transport: transporter 
    });

exports.jobPostMail = (employer, job) => email.send({
    template: path.join(__dirname, '../', 'views', 'JobPost'),
    message: {
    to: 'tmsusha@gmail.com' // employer.username
    },
    locals: {
    name:employer.username,
    available:employer.jobtier.allowed-employer.jobtier.posted,
    title:job.title,
    profession:job.profession,
    specialization:job.specialization,
    expiry:job.expireAt,
  }}).then(console.log)
  .catch(console.error);
