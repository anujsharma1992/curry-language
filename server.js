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