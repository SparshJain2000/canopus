const router = require("express").Router(),
  passport = require("passport"),
  middleware = require('../middleware/index');
  const fs = require("fs"),
  path = require('path');
  //filePath = path.join(__dirname, '../canopus-frontend/build/data.json');
  
  router.get("/",(req,res)=>{
   // res.render("https://canopus.blob.core.windows.net/mail-image/privacy_temp.html");
   // res.render("<html><body><h1>Hello</h1></body></html>")
   res.sendFile('privacy.html', {
    root: path.join(__dirname, '../views/')
})
  });

  module.exports = router;