var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    social_id: { type: String, unique: true, index: true, sparse: true },
    user_signup_type: { type: Number, default: 1 },//1 for Normal User,2 for Social User
    name: { type: String },
    email: { type: String, lowercase: true, unique: true, index: true, sparse: true },
    phone: { type: String, unique: true, index: true, sparse: true },
    password: { type: String },
    new: { type: Boolean },
    otp: { type: String },
    device_token: { type: String },
    //Advance Details
    pic: { type: String },
    dob: { type: String },
    about: { type: String },
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    //Language_Selection
    fluency: { type: Schema.Types.ObjectId, ref: 'Fluency' },
    reason: { type: Schema.Types.ObjectId, ref: 'Reason' },
    user_languages: [{ type: Schema.Types.ObjectId, ref: 'Language' }],
    language: { type: Schema.Types.ObjectId, ref: 'Language' },
    status:{type:Boolean,default:true},
    is_otp_verified: { type: Boolean },
    timestamp: { type: Date, required: true, default: Date.now }
});

userSchema.plugin(uniqueValidator, { message: 'is already taken.' });


module.exports = mongoose.model('User', userSchema);