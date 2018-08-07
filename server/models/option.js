var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var optionSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    title: { type: String },
    image: { type: String },
    audio: { type: String },
    question_id: { type: Schema.ObjectId, ref: 'Question', required: true },
    is_correct: { type: Boolean },
    is_active: { type: Boolean, default: true },
    timestamp: { type: Date, required: true, default: Date.now }    
})

module.exports = mongoose.model('Option', optionSchema);