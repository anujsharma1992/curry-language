var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var questionSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    question_title: { type: String },
    question_image: { type: String },
    question_audio: { type: String },
    vocab_count: { type: Number },
    chapter_id: { type: Schema.ObjectId, ref: 'Chapter'},
    question_type: { type: Schema.ObjectId, ref: 'QuestionType', required: true },
    options: { type: Object,  default: null},
    is_active: { type: Boolean, default: true },
    is_header: { type: Boolean, default: false },
    timestamp: { type: Date, required: true, default: Date.now }    
})

module.exports = mongoose.model('Question', questionSchema);