var mongoose = require('mongoose');

var Schema = mongoose.Schema;
var trySchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    image: { type: String },
    word: { type: String },
    translate_word:{ type: Object,  default: null},
    timestamp: { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('Try', trySchema);