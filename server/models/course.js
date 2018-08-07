var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var courseSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    name: { type: String, required: true },
    image: { type: String},
    language_id: { type: Schema.ObjectId, ref: 'Language', required: true },
    chapters: [{ type: Schema.Types.ObjectId, ref: 'Chapter' }],
    desc: { type: String, required: true  },
    is_active: { type: Boolean, default: true },
    course_type: { type: String, default: 'main' },
    timestamp: { type: Date, required: true, default: Date.now }    
})

module.exports = mongoose.model('Course', courseSchema);