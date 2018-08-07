var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userScoreSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    chapter: { type: Schema.Types.ObjectId, ref: 'Chapter' },
    course: { type: Schema.Types.ObjectId, ref: 'Course' },
    score: { type: Number },
    timestamp: { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('userScore', userScoreSchema);