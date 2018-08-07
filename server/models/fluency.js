var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var fluencySchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    name: { type: String, required: true },
    is_active: { type: Boolean, default: true },
    timestamp: { type: Date, required: true, default: Date.now }    
})

module.exports = mongoose.model('Fluency', fluencySchema);