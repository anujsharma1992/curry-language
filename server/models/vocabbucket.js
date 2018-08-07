var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var vocabBucketSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    cat_id: { type: mongoose.Schema.ObjectId, ref: 'Bucketcategory' },
    title: { type: String},
    image: { type: String },
   // audio:{type:String},
    word: { type: String },
    translate_word: {type: Object },
    description: { type: String },
    timestamp: { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('Vocabbucket', vocabBucketSchema);