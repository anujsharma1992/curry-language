var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var questionTypeSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    title: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now }    
})

module.exports = mongoose.model('QuestionType', questionTypeSchema);