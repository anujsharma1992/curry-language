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




global.sendgridHelper = require('sendgrid').mail;
global.sendgridObj = require('sendgrid')('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');/* All config set to be in env file and then no need to hardcode it.*/
global.ExternalService = require("./helpers/common-service");
