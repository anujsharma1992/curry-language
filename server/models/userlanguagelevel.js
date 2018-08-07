var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userLanguageLevelSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    language: { type: Schema.Types.ObjectId, ref: 'Language' },
    fluency: { type: Schema.Types.ObjectId, ref: 'Fluency' },
    reason: { type: Schema.Types.ObjectId, ref: 'Reason' },
    timestamp: { type: Date, required: true, default: Date.now }   
})

module.exports = mongoose.model('UserLanguageLevelSchema', userLanguageLevelSchema);