const mailController=require("../controllers/mail.controller");
require("dotenv").config();
   const admin=process.env.ADMIN_MAIL
   const Email=require('email-templates');
   const path=require('path');

   mailController.transporter.verify().then((success)=>{
     console.log("server is ready");
   const email = new Email({
    views: {root:'./canopus-backend/', options: { extension: 'ejs' } },
    message: {
      from: admin,	
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
    transport: mailController.transporter
    //transport: {
    //jsonTransport: true
    //}
    
  });
  console.log( path.join(__dirname, '../', 'views', 'JobPost'))
  email.send({
    template: path.join(__dirname, '../', 'views', 'JobPost'),
    message: {
      to: 'tmsusha@gmail.com'//,
    },
    locals: {
      name:'Company XYZ',
      available:'3',
      title:'Heart Surgeon',
      profession:'Surgeon',
      specialization:'Cardio-Vascular Medicine',
      expiry:'31st August 2020',
    }
  })
  .then(console.log)
  .catch(console.error);
   }).catch((err)=>console.log(err));