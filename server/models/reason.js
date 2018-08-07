var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var reasonSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    name: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    timestamp: { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('Reason', reasonSchema);