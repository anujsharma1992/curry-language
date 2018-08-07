var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var bucketCategorySchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    language_id: { type: mongoose.Schema.ObjectId,ref: 'language' },
    title: { type: String, required: true },
    image: { type: String },
    timestamp: { type: Date, required: true, default: Date.now }
})

module.exports = mongoose.model('Bucketcategory', bucketCategorySchema);