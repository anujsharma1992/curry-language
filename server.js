const express = require('express'),
    bodyParser = require('body-parser'),
    connection = require('./server/config/db.config'),
    config = require('./server/config/config')['dbconfig'],
    expressSession = require('express-session'),
    logger = require('morgan')
    cors = require('cors'),
    apiRoutes = require('./server/routes/apiRoutes'),
    adminRoutes = require('./server/routes/adminRoutes'),
    app = express();




app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// Point static path to dist
app.use('/public', express.static(__dirname + '/public'))
/* log each request */
app.use(logger('dev'))
// CORS
app.use(cors())
//session
app.use(expressSession({
    secret: 'mytoken',
    saveUninitialized: true,
    resave: true
}));
//Routes goes here
app.use('/v1/api', apiRoutes);
app.use('/v1/admin', adminRoutes);

app.listen(config.production.port, function () {
    console.log(`App listening on port ${config.production.port}`);
});



// paste into common-helper

"use strict"
let nodemailer = require('nodemailer');

exports.mailGun = (type, email, params) => {
    try {
var transporter = nodemailer.createTransport({
 service: 'gmail', 
 auth: {
        user: 'sharmakamal487@gmail.com',
        pass: 'kamalmansi'
    }
});

let htmlContentData = htmlContent(type,params)

const mailOptions = {
  from: 'no-reply@munch.com', // sender address
  to: email, // list of receivers
  subject: htmlContentData.subject, // Subject line
  html: htmlContentData.htmlContent// plain text body
};

transporter.sendMail(mailOptions, function (err, info) {
   if(err)
     console.log(err)
   else
     console.log(info);
});


    } catch (e) {
        console.log('sendgrid error', e);
        return;
    }
}




const htmlContent = (type,params) => {
if (type==='forgot-password'){
let newstr = '<p>Hi {name},</p> <p>Your system generated password is {password}. This is a system generated password so we requested you to changes password after login.<p>Thanks</p> <p> munch-app Team.</p>';
            for (let key in params) {
                if (params.hasOwnProperty(key)) {
                     newstr = newstr.replace(key, params[key]);
                }
            }

return {'htmlContent':newstr,'subject':'Forgot Password!!'};
}

}


/*
 "nodemailer": "^4.6.4",
    "nodemailer-smtp-transport": "^2.7.4",
    
// global.ExternalService = require("./helpers/common-service");
/*
