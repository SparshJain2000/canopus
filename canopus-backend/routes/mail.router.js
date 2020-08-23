const mailController=require("../controllers/email.controller");
require("dotenv").config();
   const ADMIN_MAIL=process.env.ADMIN_MAIL;
   console.log(ADMIN_MAIL);
    const message = {
        from: ADMIN_MAIL, // Sender address
        to: 'tmsusha@gmail.com',         // List of recipients
        subject: 'Design Your Model S | Tesla', // Subject line
        text: 'Have the most fun you can in a car. Get your Tesla today!' // Plain text body
    };
    mailController.transport.sendMail(message, function(err, info) {
        if (err) {
          console.log(err)
        } else {
          console.log(info);
        }
    });