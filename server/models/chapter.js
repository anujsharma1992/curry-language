var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var chapterSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    name: { type: String, required: true },
    image: { type: String},
    description: {type: String},
    course_id: { type: mongoose.Schema.ObjectId,  required: true },
    desc: { type: String }, // , required: true
    gems: { type: String,default:0 }, // , required: true
    bucket: { type: String},
    questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }],
    vocab_Words: [{ type: Schema.Types.ObjectId, ref: 'vocabWords' }],
    questions_types: [{ type: Schema.Types.ObjectId, ref: 'QuestionType' }],
    is_active: { type: Boolean, default: true },
    buckets: { type: Object,  default: null},
    timestamp: { type: Date, required: true, default: Date.now }    
})

module.exports = mongoose.model('Chapter', chapterSchema);