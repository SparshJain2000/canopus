require("dotenv").config();
const mailgun = require("mailgun-js");
const DOMAIN = "sandboxa6c1b3d7a13a4122aaa846d7cd3f96a2.mailgun.org";
const api=process.env.MG_API;
const ADMIN_MAIL=process.env.ADMIN_MAIL;
const mg = mailgun({apiKey: api, domain: DOMAIN});
const mailController={}
// const data = {
// 	from: "postmaster@sandboxa6c1b3d7a13a4122aaa846d7cd3f96a2.mailgun.org",
// 	to: "sushant.krishnan2000@gmail.com",
// 	subject: "Hello",
// 	template: "forgot",
// //	'h:X-Mailgun-Variables': {reset_url: "test"}
// };
// mg.messages().send(data, function (error, body) {
    
    
//     console.log(body);
// })

async function forgotMail(req,user,token){
    
    const data = {
        from: ADMIN_MAIL,
        to: "example@gmail.com",
        subject: "Hello",
        template: "forgot2",
        //v:reset_url:`https://${req.headers.host}/reset/${token}`
        //h:X-Mailgun-Variables:
        'h:X-Mailgun-Variables': JSON.stringify({
            test:'http://localhost:3000/reset',
           
          })
    };
    mg.messages().send(data, function (error, body) {
    
            if(error)
            return error;
            else
            return body;
        })
    }

    exports.mailController={forgotMail};
// const sgMail = require('@sendgrid/mail');
// sgMail.setApiKey(process.env.SENDGRID_API_KEY);
// const msg = {
//   to: 'sushant.krishnan200@gmail.com',
//   from: 'tmsusha@gmail.com',
//   subject: 'Sending with Twilio SendGrid is Fun',
//   text: 'and easy to do anywhere, even with Node.js',
//   html: '<strong>and easy to do anywhere, even with Node.js</strong>',
// };
// sgMail.send(msg).then((res)=>console.log(res)).catch((err)=>console.log(err));
// // let transporter = nodemailer.createTransport({
//         host: 'smtp.mailgun.org',
//         port: 587,
//         auth: {
//            user: ADMIN_MAIL,
//            pass: smtp_pass
//         }
//     });

// transporter.verify().then((success)=>{
//       console.log("Server is ready to send messages");
//     }).catch((err)=>console.log(err));  
    
//  const email = new Email({
//       views: {root:'./canopus-backend/', options: { extension: 'ejs' } },
//       message: {
//       from: ADMIN_MAIL,	
//       // attachments:
//       // [{
//       //   filename:'hello.txt',
//       //   path:'./server/files/hello.txt',
//       //   contentType:'text/plain'
//       // },
//       // {
//       //   filename:'sample.txt',
//       //   content:'sample attachement - content',
//       //   contentType:'text/plain'
//       // }]
//       },
//       preview:false,
//       send: true,
//       transport: transporter 
//     });

// exports.jobPostMail = (employer, job) => email.send({
//     template: path.join(__dirname, '../', 'views', 'JobPost'),
//     message: {
//     to: 'tmsusha@gmail.com' // employer.username
//     },
//     locals: {
//     name:employer.username,
//     available:employer.jobtier.allowed-employer.jobtier.posted,
//     title:job.title,
//     profession:job.profession,
//     specialization:job.specialization,
//     expiry:job.expireAt,
//   }}).then(console.log)
//   .catch(console.error);
