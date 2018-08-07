var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var languageSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    name: { type: String, required: true },
    image: { type: String},
    bg_image: { type: String},
    courses: [{ type: Schema.Types.ObjectId, ref: 'Course' }],
    is_active: { type: Boolean, default: true },
    timestamp: { type: Date, required: true, default: Date.now }    
})

module.exports = mongoose.model('Language', languageSchema);