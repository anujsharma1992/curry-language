var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var adminuserSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    email: { type: String, required: true },
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    password: { type: String, required: true },
    is_active: { type: Boolean, default: true }
})

module.exports = mongoose.model('Adminuser', adminuserSchema);