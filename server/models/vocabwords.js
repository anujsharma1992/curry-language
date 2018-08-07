var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var vocabWordsSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    title: { type: String, required: true },
    image: { type: String },
    audio: { type: String },
    timestamp: { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('vocabWords', vocabWordsSchema);