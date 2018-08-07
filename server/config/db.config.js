var mongoose = require('mongoose');
dbconfig = require('./config')['dbconfig'];

let connection;
// if (process.env.NODE_ENV === 'development') {
    var config = dbconfig['development'];
    connection = mongoose.connect(`mongodb://${config.database.HOST}:${config.database.MONGO_PORT}/${config.database.MONGO_DB}`);
// } else {
    // var config = dbconfig['development'];
    // connection = mongoose.connect(`mongodb://${config.database.MONGO_USERNAME}:${config.database.MONGO_PASSWORD}@${config.database.HOST}:${config.database.MONGO_PORT}/${config.database.MONGO_DB}?authSource=${config.database.MONGO_AUTH_DB}`);
// }
module.exports = connection;


