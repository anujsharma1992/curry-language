var express = require('express'), avatar
secretkey = require('../config/config')["secretkey"];

jwt = require('jsonwebtoken');
mongoose = require('mongoose');
router = express.Router();


var userScore = require('../models/userScore');
var User = require('../models/user');

// router.post('/login', function (req, res) {
//     if ((req.body.email || req.body.phone) && req.body.password) {
//         var qry = {
//             password: req.body.password,
//             $or: [{
//                 email: req.body.email
//             }, {
//                 phone: req.body.phone
//             }]
//         }
//         User.findOne(qry, '-new -password').populate({
//             path: 'language',
//             select: 'name image bg_image',
//         })
//             .exec(function (err, user) {
//                 if (err) res.status(500).json({ "error_code": 500, "message": err });
//                 if (user !== undefined && user !== null) {
//                     // if user found then create a token
//                     var token = jwt.sign({
//                         email: user.email,
//                         password: user.password,
//                     }, secretkey);
//                     var authObj = {
//                         data: user,
//                         message: user.is_otp_verified ? "success" : "Otp Not Verified",
//                         error_code: user.is_otp_verified ? 200 : 200,//On Demand Of IOS Team
//                         advance_details: user.dob != '' ? true : false,
//                         is_otp_verfied: user.is_otp_verified,
//                         language_selection: user.language == null || user.fluency == null || user.reason == null ? false : true,
//                         token: user.is_otp_verified ? token : ''
//                     };
//                     // return the information including token as JSON
//                     res.status(200).send(authObj);
//                 } else {
//                     res.status(200).send({ "error_code": 704, "property": "user", "message": "User Not Found" });
//                 }
//             });
//     } else {
//         res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
//     }
// });

router.post('/login', function (req, res) {
    if ((req.body.email || req.body.phone) && req.body.password) {
        var qry = {
            password: req.body.password,
            $or: [{
                email: req.body.email
            }, {
                phone: req.body.phone
            }]
        }
        User.findOne(qry, '-new -password').populate({
            path: 'language',
            select: 'name image bg_image',
        })
            .exec(function (err, user) {
                if (err) res.status(500).json({ "error_code": 500, "message": err });
                if (user !== undefined && user !== null) {
                    var gems=0;
                    data = {};
                    userScore.find({"user":user._id }).populate({
                        path: 'chapter',select:'name gems _id'
                    }).exec(function (err, chapter_data) {
                        console.log(chapter_data,"chapter")
                        if(chapter_data && chapter_data.length>0){
                            for(d in chapter_data){
                                gems = chapter_data[d].chapter?gems +parseInt(chapter_data[d].chapter.gems):0;
                            }
                        }
                
                    var token = jwt.sign({
                        email: user.email,
                        password: user.password,
                    }, secretkey);
                    var authObj = {
                        data: user,
                        message: user.is_otp_verified ? "success" : "Otp Not Verified",
                        error_code: user.is_otp_verified ? 200 : 200,//On Demand Of IOS Team
                        advance_details: user.dob != '' ? true : false,
                        is_otp_verfied: user.is_otp_verified,
                        language_selection: user.language == null || user.fluency == null || user.reason == null ? false : true,
                      //  total_chapter = user.chapters ? user.chapters.length:0,
                        gems: parseInt(gems?gems:0),
                        token: user.is_otp_verified ? token : ''
                    };
               
                
                
                // return the information including token as JSON
                    res.status(200).send(authObj);
                })
                } else {
                    res.status(200).send({ "error_code": 704, "property": "user", "message": "User Not Found" });
                }
            
            });
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
});

router.post('/sign-up', function (req, res) {
    if (req.body.email && req.body.password) {
        var body = req.body;
        var userObj = new User(body);
        userObj.phone = userObj.phone ? userObj.phone : '';
        userObj.dob
        userObj.pic = '';
        userObj.dob = '';
        userObj.about = '';
        userObj.language = null;
        userObj.fluency = null;
        userObj.reason = null;
        userObj.otp = '1234';
        userObj.is_otp_verified = false;
        userObj.new = true;
        userObj.save(function (err, user) {
            if (err) {
                console.log(err.name)
                let count = 0, err_c, prpty, msg;;
                switch (err.name) {
                    case 'ValidationError':
                        for (field in err.errors) {
                            if (count == 0) {
                                switch (err.errors[field].properties.type) {
                                    case 'invalid':
                                        err_c = 701;
                                        count++;
                                        res.status(200).json({ "error_code": err_c, "property": field, "message": "Invalid Format" });
                                        break;
                                    case 'unique':
                                        err_c = 702;
                                        count++;
                                        res.status(200).send({ "error_code": err_c, "property": field, "message": "Already Exist" });
                                        break;
                                    case 'user defined':
                                        err_c = 701;
                                        count++;
                                        res.status(200).send({ "error_code": err_c, "property": field, "message": "Invalid Format" });
                                        break;
                                    case 'regexp':
                                        err_c = 701;
                                        count++;
                                        res.status(200).send({ "error_code": err_c, "property": field, "message": "Invalid Format" });
                                        break;
                                    case 'required':
                                        err_c = 703;
                                        count++;
                                        res.status(200).send({ "error_code": err_c, "property": field, "message": "Required" });
                                        break;
                                    default:
                                        count++;
                                        res.status(500).json({ "error_code": 500, "message": err });
                                }
                            }
                        }
                        break;
                    default:
                        res.status(500).json({ "error_code": 500, "message": err });
                }
            } else {
                var extraDetails = {
                    new: user.new,
                    advance_details: user.dob != '' ? true : false,
                    is_otp_verfied: user.is_otp_verified,
                    language_selection: user.language == null || user.fluency == null || user.reason == null ? false : true,
                    status: user.new ? 201 : 200,
                    error_code: user.new ? 201 : 200,
                }
                var statusCode = user.new ? 201 : 200;
                var finalRes = {
                    data: user,
                    message: "Success"
                }
                if (extraDetails && Object.keys(extraDetails).length) {
                    Object.assign(finalRes, extraDetails)
                }
                res.status(200).send(finalRes);
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
});

function createSocialSignup(req, callback) {
    // params should be social_id,email,phone
    var body = req.body;
    var userObj = new User(body);
    if (req.files && req.files['avatar']) {
        userObj.pic = typeof req.files != 'undefined' && typeof req.files['avatar'] != 'undefined' && req.files['avatar'].length ? req.files['avatar'][0].filename : '';
    } else {
        userObj.pic = '';
    }
    userObj.dob = '';
    userObj.about = '';
    userObj.language = null;
    userObj.fluency = null;
    userObj.reason = null;
    userObj.password = '';
    userObj.otp = '1234';
    userObj.user_signup_type = 2;
    userObj.is_otp_verified = true;
    userObj.new = true;
    userObj.save(function (err, doc) {
        if (err) {
            callback(err, null);
        } else {
            User.findOne({ "_id": doc._id }).populate({
                path: 'language',
                select: 'name image bg_image',
            }).exec(function (err, user) {
                var token = jwt.sign({
                    email: user.email ? user.email : user.phone,
                }, secretkey);
                var extraDetails = {
                    new: user.new,
                    advance_details: user.dob != '' ? true : false,
                    is_otp_verfied: user.is_otp_verified,
                    language_selection: user.language == null || user.fluency == null || user.reason == null ? false : true,
                    status: 201,
                    error_code: 201,
                    token: user.is_otp_verified ? token : ''
                }
                var statusCode = 201;
                if (!user.email) {
                    user.email = '';
                }
                if (!user.phone) {
                    user.phone = '';
                }
                var finalRes = {
                    data: user,
                    message: "Success"
                }
                if (extraDetails && Object.keys(extraDetails).length) {
                    Object.assign(finalRes, extraDetails)
                }
                callback(null, finalRes);
            })
        }
    })
}

router.post('/social-login', function (req, res) {
    if (req.body.social_id) {
        User.findOne({ "social_id": req.body.social_id }).populate({
            path: 'language',
            select: 'name image bg_image',
        }).exec(function (err, user) {
            if (err) res.status(500).json({ "error_code": 500, "message": err });
            if (user !== undefined && user !== null) {
                // if user found then create a token for signin(Social_id exist)
                var token = jwt.sign({
                    email: user.email ? user.email : user.phone,
                }, secretkey);
                if (!user.email) {
                    user.email = '';
                }
                if (!user.phone) {
                    user.phone = '';
                }
                var authObj = {
                    data: user,
                    message: user.is_otp_verified ? "success" : "Otp Not Verified",
                    error_code: user.is_otp_verified ? 200 : 200,//On Demand Of IOS Team
                    advance_details: user.dob != '' ? true : false,
                    is_otp_verfied: user.is_otp_verified,
                    language_selection: user.language == null || user.fluency == null || user.reason == null ? false : true,
                    token: user.is_otp_verified ? token : ''
                };
                // return the information including token as JSON
                res.status(200).send(authObj);
            } else {
                // if user Not found then Signup or send error(Social_id not exist)
                if (req.body.email || req.body.phone) {
                    checkUserExistWithProp(req.body.email, req.body.phone, function (err, message, is_exist) {
                        if (err) {
                            res.status(500).json({ "error_code": 500, "message": err });
                        } else {
                            if (is_exist) {
                                // send error
                                res.status(200).json({ "error_code": 702, "message": message });
                            } else {
                                //signup
                                createSocialSignup(req, function (err, data) {
                                    if (err) {
                                        fetchErrorType(err, function (error_code, property, message) {
                                            if (error_code == "500") {
                                                res.status(500).send({ "error_code": error_code, "message": message });
                                            } else {
                                                res.status(200).send({ "error_code": error_code, "property": property, "message": message });
                                            }
                                        })
                                    } else {
                                        res.status(200).send(data);
                                    }
                                })
                            }
                        }
                    })
                } else {
                    res.status(200).json({ "error_code": 707, "message": "Incomplete params to create Social User" });
                }
            }
        });
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

function checkUserExistWithProp(email, phone, cb) {
    if (email) {
        User.find({ "email": email }, function (err, doc) {
            if (err) {
                cb(err, null, null);
            } else {
                if (doc.length) {
                    cb(null, 'Email associated with this account already registered', true);
                } else {
                    cb(null, 'Email Not Exist', false);
                }
            }
        })
    } else if (phone) {
        User.find({ "phone": phone }, function (err, doc) {
            if (err) {
                cb(err, null, null);
            } else {
                if (doc.length) {
                    cb(null, 'Phone Number associated with this account already registered', true);
                } else {
                    cb(null, 'Phone Not Exist', false);
                }
            }
        })
    }
}
router.post('/verify-otp', function (req, res) {
    if (typeof req.body.otp === 'undefined' || !req.body.otp) {
        res.status(200).json({ "error_code": 404, "message": "Please Send Otp" })
    } else {
        User.findById(req.body.user_id, '-password -new').exec(function (err, doc) {
            if (err) {
                res.status(500).json({ "error_code": 500, "message": err });
            } else {
                if (doc) {
                    if (doc.otp == req.body.otp.toString().trim()) {
                        doc.is_otp_verified = true
                        doc.save(function (err, updatedUser) {
                            if (err) {
                                res.status(500).json({ "error_code": 500, "message": err });
                            } else {
                                // if user found then create a token
                                var token = jwt.sign({
                                    email: updatedUser.email,
                                    password: updatedUser.password,
                                }, secretkey);

                                var finalRes = {
                                    data: updatedUser,
                                    message: "success",
                                    error_code: 200,
                                    token: token
                                }
                                res.status(200).json(finalRes);
                            }
                        });
                    } else {
                        res.status(200).json({ "error_code": 705, "message": "otp not matched" })
                    }
                } else {
                    res.status(200).send({ "error_code": 704, "message": "User Not Found" })
                }

            }
        })
    }
})

router.post('/complete-profile', function (req, res) {
    if (req.body.user_id) {
        User.findById(req.body.user_id, '-new -password', function (err, user) {
            if (err) {
                res.status(500).json({ "error_code": 500, "message": err });
            } else {
                if (user) {
                    if (req.files && req.files['avatar']) {
                        user.pic = typeof req.files != 'undefined' && typeof req.files['avatar'] != 'undefined' && req.files['avatar'].length ? req.files['avatar'][0].filename : '';
                    } else {
                        user.pic = '';
                    }
                    user.dob = req.body.dob ? req.body.dob : ''
                    user.about = req.body.about ? req.body.about : ''
                    user.save(function (err, updatedUser) {
                        if (err) {
                            res.status(500).json({ "error_code": 500, "message": err });
                        } else {
                            var finalRes = {
                                data: updatedUser,
                                message: "success",
                                error_code: 200,
                            }
                            res.status(200).json(finalRes);
                        }
                    })
                } else {
                    res.status(200).json({ "error_code": 706, "message": "user_id not exist" });
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete Params" });
    }

})

router.get('/fetch-all-users', function (req, res) {
    User.find({}, function (err, doc) {
        res.json(doc);
    })
})

router.post('/change-password', function (req, res) {
    if (req.body.user_id && req.body.old_password && req.body.new_password) {
        User.findById(req.body.user_id, function (err, user) {
            if (err) {
                res.status(500).json({ "error_code": 500, "message": err });
            } else {
                if (user) {
                    if (user.password.trim() === req.body.old_password.toString().trim()) {
                        user.password = req.body.new_password.toString()
                        user.save(function (err, doc) {
                            if (err) {
                                res.status(200).json({ "error_code": 709, "message": "password Not Reset", "error": err });
                            } else {
                                res.status(200).json({ "error_code": 200, "message": "success" });
                            }
                        })
                    } else {
                        res.status(200).json({ "error_code": 708, "message": "Old Password Not Matched" });
                    }
                } else {
                    res.status(200).json({ "error_code": 706, "message": "user_id not exist" });
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

router.post('/resetpassword-otpreq', function (req, res) {
    if (req.body.phone || req.body.email) {
        var qry = {
            $or: [{
                email: req.body.email
            }, {
                phone: req.body.phone
            }]
        }
        User.findOne(qry, function (err, user) {
            if (err) {
                res.status(500).json({ "error_code": 500, "message": err });
            } else {
                if (user) {
                    //Send Otp to phone code goes here
                    var userdata = {
                        otp: user.otp,
                        user_id: user._id
                    }
                    res.status(200).json({ "data": userdata, "error_code": 200, "message": "success" });
                } else {
                    res.status(200).json({ "error_code": 709, "message": "phone number not exist" });
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

router.post('/reset-password-phone', function (req, res) {
    if (req.body.user_id && req.body.new_password) {
        User.findById(req.body.user_id, function (err, user) {
            if (err) {
                res.status(500).json({ "error_code": 500, "message": err });
            } else {
                if (user) {
                    user.password = req.body.new_password
                    user.save(function (err, doc) {
                        if (err) {
                            res.status(200).json({ "error_code": 709, "message": "password Not Reset" });
                        } else {
                            res.status(200).json({ "error_code": 200, "message": "success" });
                        }
                    })
                } else {
                    res.status(200).json({ "error_code": 706, "message": "user_id Not Exist" });
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

router.post('/save-device-token', function (req, res) {
    if (req.body.user_id && req.body.device_token) {
        User.findById(req.body.user_id, function (err, user) {
            if (err) {
                res.status(500).json({ "error_code": 500, "message": err });
            } else {
                if (user) {
                    user.device_token = req.body.device_token
                    user.save(function (err, doc) {
                        if (err) {
                            res.status(200).json({ "error_code": 709, "message": "device_token Not Save" });
                        } else {
                            res.status(200).json({ "error_code": 200, "message": "success" });
                        }
                    })
                } else {
                    res.status(200).json({ "error_code": 706, "message": "user_id Not Exist" });
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

router.post('/opt-language', function (req, res) {
    if (req.body.user_id && req.body.language_id) {
        User.findById(req.body.user_id, function (err, user) {
            if (err) {
                res.status(500).json({ "error_code": 500, "message": err });
            } else {
                if (user) {
                    user.languages.push(req.body.language_id)
                    user.save(function (err, doc) {
                        if (err) {
                            res.status(200).json({ "error_code": 709, "message": "device_token Not Save" });
                        } else {
                            res.status(200).json({ "error_code": 200, "message": "success" });
                        }
                    })
                } else {
                    res.status(200).json({ "error_code": 706, "message": "user_id Not Exist" });
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

router.post('/fetch-user-languages', function (req, res) {
    if (req.body.user_id) {
        User.findById(req.body.user_id).populate({
            path: 'languages',
            match: { is_active: true },
            select: 'name',
            options: { limit: 5 }
        }).exec(function (err, user) {
            if (err) {
                res.send(err);
            } else {
                res.send(user);
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

router.post('/fetch-languages-user', function (req, res) {
    if (req.body.language_id) {
        User.find({ "languages": { $in: [req.body.language_id] } }).select('email').exec(function (err, user) {
            if (err) {
                res.send(err);
            } else {
                res.send(user);
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

router.post('/user-view-profile', function (req, res) {
    if (req.body.user_id) {
        User.findOne({ "_id": req.body.user_id }).select('-user_languages -password -language -fluency -reason').exec(function (err, user) {
            if (err) {
                res.status(500).send({ "error_code": 500, "message": err });
            } else {
                if (user) {
                    res.status(200).send({ "error_code": 200, "data": user, "message": "success" });
                } else {
                    res.status(200).send({ "error_code": 704, "message": "User Not Found" });
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

router.post('/user-edit-profile', function (req, res) {
    if (req.body.user_id) {
        User.findOne({ "_id": req.body.user_id }).select('-user_languages -password -language -fluency -reason').exec(function (err, user) {
            if (err) {
                res.status(500).send({ "error_code": 500, "message": err });
            } else {
                if (user) {
                    user.email = req.body.email || user.email;
                    user.name = req.body.name || user.name;
                    user.dob = req.body.dob || user.dob;
                    user.phone = req.body.phone || user.phone;
                    user.about = req.body.about || user.about;
                    if (req.files && req.files['avatar']) {
                        user.pic = typeof req.files != 'undefined' && typeof req.files['avatar'] != 'undefined' && req.files['avatar'].length ? req.files['avatar'][0].filename : '';
                    } else {
                        user.pic = user.pic;
                    }
                    user.save(function (err, user) {
                        if (err) {
                            fetchErrorType(err, function (error_code, property, message) {
                                if (error_code == 500) {
                                    res.status(500).send({ "error_code": error_code, "message": message });
                                } else {
                                    res.status(200).send({ "error_code": error_code, "property": property, "message": message });
                                }
                            })
                        } else {
                            // code to get the updated data from db...
                            res.status(200).send({ "error_code": 200, "data": user, "message": "success" });
                        }
                    })
                } else {
                    res.status(200).send({ "error_code": 704, "message": "User Not Found" });
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

router.post('/user-update-basic', function (req, res) {
    if (req.body.user_id) {
        User.findOne({ "_id": req.body.user_id }).select('-password -language -fluency -reason').exec(function (err, user) {
            if (err) {
                res.status(500).send({ "error_code": 500, "message": err });
            } else {
                if (user) {
                    user.language = req.body.language || user.language;
                    user.fluency = req.body.fluency || user.fluency;
                    user.reason = req.body.reason || user.reason;
                    //user. = true;
                    user.save(function (err, user) {
                        if (err) {
                            fetchErrorType(err, function (error_code, property, message) {
                                if (error_code == 500) {
                                    res.status(500).send({ "error_code": error_code, "message": message });
                                } else {
                                    res.status(200).send({ "error_code": error_code, "property": property, "message": message });
                                }
                            })
                        } else {
                            // code to fetch updated data...
                            User.findOne({"_id":req.body.user_id}, '-password').populate({
                                path: 'language',
                                select: 'name image bg_image',
                            }).exec(function (err, userData) {
                                    if (err) res.status(500).json({ "error_code": "500", "message": err });
                                    if (userData !== undefined && userData !== null) {
                                        userData.language_selection = user.language == null || user.fluency == null || user.reason == null ? false : true,
                                        res.status(200).send({ "error_code": 200, "data": userData, "message": "success" });
                                    } else {
                                        res.status(200).send({ "error_code": 704, "property": "user", "message": "User Not Found" });
                                    }
                                });

                        }
                    })
                } else {
                    res.status(200).send({ "error_code": 704, "message": "User Not Found" });
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})

router.post('/match-users',function(req,res){ 
    
    var matched_user = []; 
    var i=0;
    var dataLength = req.body.user_contacts.length;
    var matchData = function(arr){
        getEachData(arr[i],function(){
            i++;
            if(i<arr.length){
                matchData(arr);
            }
        })
    }

    // method to fetch each record wise....
    function getEachData(data,callback){
        if(data.type=="mobile"){
        User.findOne({"phone":data.mobile}).select('name email social_id pic').exec(function(err,udata){
            if(err){
                res.status(500).send({ "error_code": 500, "message": err });
            }
            if(udata){
                // Code to get the fetched user gems...
                 var gems=0;
                 var dataObj={};
                userScore.find({"user":udata._id }).populate({
                    path: 'chapter',select:'name gems _id'
                }).exec(function (err, chapter_data) {
                    console.log(chapter_data,"gems data1")
                    if(chapter_data && chapter_data.length>0){
                        for(d in chapter_data){
                            gems = chapter_data[d].chapter?gems +parseInt(chapter_data[d].chapter.gems):0;
                        }
                    }
                    dataObj._id = udata._id;
                    dataObj.pic = udata.pic;
                    dataObj.name = udata.name;
                    dataObj.email = udata.email;
                    dataObj.gems = gems?gems:0;
                    matched_user.push(dataObj);
                    callback();
                })
                //callback();
            //end code to gett the fetched user gems...
            }
            else{
                callback();
            }
            if(i==dataLength){
                res.status(200).send({ "error_code": 200, "result": matched_user });
            }
                
        })                
    }
    else{
        User.findOne({"social_id":data.facebook_id}).select('name email social_id pic').exec(function(err,udata){
            if(err){
                res.status(500).send({ "error_code": 500, "message": err });
            }
            if(udata){
                // Code to get the fetched user gems...
                var gems=0;
                var dataObj = {};
                userScore.find({"user":udata._id }).populate({
                    path: 'chapter',select:'name gems _id'
                }).exec(function (err, chapter_data) {
                    console.log(chapter_data,"gems data2")
                    if(chapter_data && chapter_data.length>0){
                        for(d in chapter_data){
                        gems = chapter_data[d].chapter?gems +parseInt(chapter_data[d].chapter.gems):0;
                        }
                    }
                    dataObj._id = udata._id;
                    dataObj.pic = udata.pic;
                    dataObj.name = udata.name;
                    dataObj.email = udata.email;
                    dataObj.gems = gems?gems:0;
                    matched_user.push(dataObj);
                    callback();
                })
            //end code to gett the fetched user gems...
                // matched_user.push(udata);
                // callback();
            }
            else{
                callback();
            }
            if(i==dataLength){
                res.status(200).send({ "error_code": 200, "result": matched_user });
            }
                
        })                
    }
        
    }

    matchData(req.body.user_contacts);
})

router.post('/add-friend',function(req,res){
    User.findOne({"_id":req.body.user_id,"friends":{"$in":[req.body.friend_id]}},function(err,user){
        if(err){
            res.status(500).send({"error_code":200,"message":err})
        }
        console.log(user);
        if(user){
            res.status(200).send({ "error_code": 404, "message": 'User is already your friend' });
            return;
        }
        else{
            User.update({"_id":req.body.user_id},{$push:{friends:req.body.friend_id}},function(err,done){
                res.status(200).send({ "error_code": 200, "message": 'Friend added successfully!' });
            });
        }
    });
})

router.post('/fetch-all-friends',function(req,res){
    if(req.body.user_id){
        var qry = {
            _id:req.body.user_id
        }
        User.findOne(qry,'name pic ').populate({
            path: 'friends',
            select : 'name pic'
        }).exec(function(err,friend){
            if(friend){
                res.status(200).send({ "error_code": 200, "message": 'success','result':friend.friends });
            }
            else{
                res.status(200).send({ "error_code": 200, "message": 'success','result':[] });
            }
            console.log(friend,'fetched data');
        })        
    }
    else{
        res.status(500).send({ "error_code": 400, "message": 'User id is missing' });    
    }
})

// API to get the user scored gems...
router.get('/get-user-gems',function(req,res){
    if(req.query.user_id){
        var gems=0;
        data = {};
        userScore.find({"user":req.query.user_id }).populate({
            path: 'chapter',select:'name gems _id'
        }).exec(function (err, chapter_data) {
            console.log(chapter_data,"chapter")
            if(chapter_data && chapter_data.length>0){
                for(d in chapter_data){
                    gems = chapter_data[d].chapter?gems +parseInt(chapter_data[d].chapter.gems):0;
                }
            }
        res.status(200).send({ "error_code": 200,"gems": parseInt(gems?gems:0) });
        })
    } else {
    res.status(200).send({ "error_code": 704, "property": "user", "message": "User Not Found" });
    }
    })
    
// Code to cheer friend...
router.get('/cheer-friend',function(req,res){
    res.status(200).json({  "message": "Friends cheersed successfully", "error_code": "200" });
    // User.findOne({"_id":req.body.user_id,"friends":{"$in":[req.body.friend_id]}},function(err,user){
    //     if(err){
    //         res.status(500).send({"error_code":200,"message":err})
    //     }else{
    //         res.status(200).json({  "message": "Friends cheersed successfully", "error_code": "200" });
    //     }
    // })    
})


router.post('/activate-deactivate', function (req, res) {
    console.log(req.body,'input params...');
    if (req.body.user_id) {
        var updateObj = {
            "status" : req.body.status
        }
        console.log(updateObj,'binded data...');
        if(req.body.status==true){
            var msg = "user activated successfully!"
        }
        else{
            var msg = "user deactivated successfully!"
        }
        User.findByIdAndUpdate({ "_id": req.body.user_id }, updateObj,function (err) {
            if (err) {
                res.status(500).json({ "error_code": "500", "message": "chapter id not exist.","error":err});
            } else {
                res.status(200).json({ "error_code": "200", "message": msg});                
            }
        })
    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
    }

})


function fetchErrorType(err, cb) {
    console.log(err)
    let count = 0, err_c, prpty, msg;;
    switch (err.name) {
        case 'ValidationError':
            for (field in err.errors) {
                if (count == 0) {
                    switch (err.errors[field].properties.type) {
                        case 'invalid':
                            err_c = 701;
                            count++;
                            cb(err_c, field, "Invalid Format")
                            break;
                        case 'unique':
                            err_c = 702;
                            count++;
                            cb(err_c, field, "Already Exist")
                            break;
                        case 'user defined':
                            err_c = 701;
                            count++;
                            cb(err_c, field, "Invalid Format")
                            break;
                        case 'regexp':
                            err_c = 701;
                            count++;
                            cb(err_c, field, "Invalid Format")
                            break;
                        case 'required':
                            err_c = 703;
                            count++;
                            cb(err_c, field, "Required")
                            break;
                        default:
                            count++;
                            cb(500, null, err)
                    }
                }
            }
            break;
        default:
            cb(500, null, err)
    }
}



module.exports = router;