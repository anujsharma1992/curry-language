var express = require('express'),
    router = express.Router();

var Language = require('../models/language');
var User = require('../models/user');
var Fluency = require('../models/fluency');
var Question = require('../models/question');
var Chapter = require('../models/chapter');
var QuestionType = require('../models/questiontype');
var Answer = require('../models/answer');
var UserLanguageLevel = require('../models/userlanguagelevel');

router.post('/add-language', function (req, res) {
    if (req.body.name) {
        var language = new Language();
        language.name = req.body.name
        if (req.files && req.files['avatar']) {
            language.image = typeof req.files != 'undefined' && typeof req.files['avatar'] != 'undefined' && req.files['avatar'].length ? req.files['avatar'][0].filename : '';
        } else {
            language.image = '';
        }
        if (req.files && req.files['bg_image']) {
            language.bg_image = typeof req.files != 'undefined' && typeof req.files['bg_image'] != 'undefined' && req.files['bg_image'].length ? req.files['bg_image'][0].filename : '';
        } else {
            language.bg_image = language.bg_image;
        }
        language.save(function (err, language) {
            if (err) {
                res.status(500).json({ "error_code": "500", "message": err });
            } else {
                res.status(201).json({ "data": language, "message": "success", "error_code": "200" });
            }
        })
    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });

    }

})

// router.post('/delete-language', function (req, res) {
//     if (req.body.language_id) {
//         Language.remove({ "_id": req.body.language_id }, function (err, data) {
//             if (err) {
//                 res.status(500).json({ "error_code": "500", "message": err });
//             } else {
//                 res.status(200).json({ "data": data, "message": "success", "error_code": "200" });
//             }
//         })
//     }else{
//         res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
//     }
//})

router.post('/delete-language', function (req, res) {
    if(req.body.language_id){
        Language.find({"_id":req.body.language_id},function(err,data){
            if(err){
            res.status(200).json(err)
            }else{
            if(data[0].courses.length == 0){
                Language.remove({ "_id": req.body.language_id }, function (err, data) {
                if (err) {
                res.status(500).json({ "error_code": "500", "message": err });
                } else {
                res.status(200).json({"message": "course has been deleted." }) }
                }) 
                }else{
                return res.status(500).json({ "data": data, "message": "Cant delete, course exists under this course.", "error_code": "500" });
                }
            }
        })
    }
})

router.get('/fetch-languages', function (req, res) {
    Language.find({ "is_active": true }, function (err, languages) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": languages, "message": "success", "error_code": "200" });
        }
    })
})
// code to fetch demo course with latest schema...

router.post('/fetch-demo',function(req,res){
    if (req.body.language_id && req.body.fluency_id && req.body.reason_id) {
        Language.findOne({"_id":req.body.language_id}).populate({
            path: 'courses',select:'name _id',
            populate: {
                path:'chapters',select:'name _id'
            }
        }).exec(function(err,language){
            if(err){
                res.status(200).json({ "error_code": "702", "message": "Language Not Found" })
            }
            else{
                if(language.courses.length==0){
                    res.status(200).json({ "error_code": "707", "message": "No any chapter available." });
                    return;
                }
                loadDemo(language, req.body.fluency_id, function (err, demo_data) {
                    if (err) {
                        res.status(500).json({ "error_code": "500", "message": "No Data Found" });
                    } else {
                        if (demo_data) {
                            res.status(200).json({ "error_code": "200", "data": demo_data, "message": "success"});

                        } else {
                            res.status(200).json({ "error_code": "404", "data": {}, "message": "success"});
                        }
                    }
                })
    }

        })
    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
    }

})


router.post('/fetch-demo-course', function (req, res) {
    if (req.body.language_id && req.body.fluency_id && req.body.reason_id) {
        Language.findOne({ "_id": req.body.language_id }).populate({
            path: 'courses', select: 'name _id',
            populate: {
                path: 'chapters', select: 'name _id'
            }
        }).exec(function (err, language) {
            if (err) {
                res.status(200).json({ "error_code": "702", "message": "Language Not Found" })
            } else {
                if (req.body.user_id) {
                    saveUserLanguageData(req.body.user_id, language._id, req.body.fluency_id, req.body.reason_id, function (err, user_data, message) {
                        loadDemo(language, req.body.fluency_id, function (err, demo_data) {
                            if (err) {
                                res.status(500).json({ "error_code": "500", "message": "No Data Found" });
                            } else {
                                if (demo_data) {
                                    res.status(200).json({ "error_code": "200", "data": demo_data, "message": "success", "userUpdated": message });

                                } else {
                                    res.status(200).json({ "error_code": "404", "data": {}, "message": "success", "userUpdated": message });
                                }
                            }
                        })
                    })
                } else {
                    loadDemo(language, req.body.fluency_id, function (err, demo_data) {
                        if (err) {
                            res.status(500).json({ "error_code": "500", "message": "No Data Found" });
                        } else {
                            if (demo_data) {
                                res.status(200).json({ "error_code": "200", "data": demo_data, "message": "success" });

                            } else {
                                res.status(200).json({ "error_code": "404", "data": {}, "message": "success" });
                            }
                        }
                    })
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
    }
})

router.post('/edit-language', function (req, res) {
    if (req.body.language_id) {
        Language.findOne({ "_id": req.body.language_id }, function (err, language) {
            if (err) {
                res.status(500).json({ "error_code": "500", "message":"language id not found!", "error": err });
            } else {
                if (language) {
                    language.name = req.body.name || language.name;
                    if (req.files && req.files['avatar']) {
                        language.image = typeof req.files != 'undefined' && typeof req.files['avatar'] != 'undefined' && req.files['avatar'].length ? req.files['avatar'][0].filename : '';
                    } else {
                        language.image = language.image;
                    }
                    if (req.files && req.files['bg_image']) {
                        language.bg_image = typeof req.files != 'undefined' && typeof req.files['bg_image'] != 'undefined' && req.files['bg_image'].length ? req.files['bg_image'][0].filename : '';
                    } else {
                        language.bg_image = language.bg_image;
                    }
                    language.save(function (err, language) {
                        if (err) {
                            res.status(500).json({ "error_code": "500", "message": err });
                        } else {
                            res.status(200).json({ "data": language, "message": "success", "error_code": "200" });
                        }
                    })
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
    }

})

router.post('/get-language-by-id', function (req, res) {
    if(req.body.language_id){
        console.log(res)
    Language.findById({ "_id": req.body.language_id }, function (err, languages) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": languages, "message": "success", "error_code": "200"})
        }
    });
    } else {
        res.status(200).json({ "message": "Incomplete params", "error_code": "402"});
    }

})


function loadDemo(language, fluency_id, cb) {
    if (language && language.courses && language.courses[0].chapters) {
        fetchFluency(fluency_id, function (err, fluency) {
            console.log(language.courses[0].chapters[0]._id,'chapter id');
            fetchDataFromChapter(language.courses[0].chapters[0]._id, function (err, data) {
                if (err) {
                    cb(err, null);

                } else {
                    cb(null, data);
                }
            })
        })
    } else {
        cb(null, null);
    }
}

function saveUserLanguageData(user_id, language_id, fluency_id, reason_id, cb) {
    User.findOne({ "_id": user_id }, function (err, user) {
        if (user) {
            user.language = language_id
            user.fluency = fluency_id
            user.reason = reason_id
            if (user.user_languages.indexOf(language_id) == -1) {
                user.user_languages.push(language_id);
            }
            user.save(function (err, user_data) {
                if (err) {
                    cb(err, null, 'User Not Updated')
                }
                UserLanguageLevel.findOne({ "user": user_id, "language": language_id, "fluency": fluency_id }, function (err, user_lan_level) {
                    if (user_lan_level) {
                        user_lan_level.user = user_id
                        user_lan_level.language = language_id
                        user_lan_level.fluency = fluency_id
                        user_lan_level.reason = reason_id
                        user_lan_level.save(function (err, data) {
                            if (err) {
                                cb(err, null, 'Language_Level No Updation Done')
                            } else {
                                cb(null, user_data, 'Language_Level Updation Done')
                            }
                        })
                    } else {
                        var user_language_level = new UserLanguageLevel();
                        user_language_level.user = user._id
                        user_language_level.language = language_id
                        user_language_level.fluency = fluency_id
                        user_language_level.reason = reason_id
                        user_language_level.save(function (err, data) {
                            if (err) {
                                cb(err, null, 'Language_Level Data Not Saved')
                            } else {
                                cb(null, user_data, 'Language_Level Data Saved')
                            }
                        })
                    }
                })
            })
        } else {
            cb(null, {}, 'User Not Found')
        }
    })
}

/*
        populate({
            path: 'questions_types', select: 'title questions -_id',
            populate: {
                path: 'questions', select: 'question_title question_image question_audio _id',
                populate: { path: 'options', select: 'title image audio is_correct _id', }
            }
        }).

*/


function fetchDataFromChapter(chapter_id, cb) {
    Chapter.findOne({ "_id": chapter_id }).select('name _id').
        populate({
            path: 'questions', select: 'question_title question_image question_audio options _id',
            populate: {
                path: 'question_type', select: 'title _id'
            }
        }).
        exec(function (err, data) {
            if (err) {
                cb(err, null);
            } else {
                var main_data ={};
                main_data.question_types = [];
                main_data._id  =  data._id; // chapter id
                main_data.name  =  data.name; // chapter name
            
                if(data.questions.length>0){
                    data.questions.forEach(function(item,i){    
                        var cur_question_type = item.question_type._id;
                        var is_exists = [];
                        is_exists = main_data.question_types.filter(function (d) { return d._id== cur_question_type;});
                        if(is_exists.length==0){
                            var obj = {}                            
                            obj.questions = [];
                            obj._id = cur_question_type;
                            obj.title = item.question_type.title;
                            obj.questions.push(item);                            
                            main_data.question_types.push(obj);
                        }                        
                        else{
                            main_data.question_types.forEach(function(v,i){
                                if(v.questions[0].question_type._id==cur_question_type){
                                    v.questions.push(item);
                                }
                            })                        }
                    })
                }
                cb(null, main_data);
            }
        })

}

function getAnswersFromQuestions(data, cb) {
    Answer.find({ "_id": data.id }, function (err, doc) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, doc)
        }
    })
}


function fetchFluency(fluency_id, cb) {
    Fluency.findOne({ "_id": fluency_id }, function (err, fluency) {
        if (err) {
            cb(err, null);
        } else {
            cb(null, fluency);
        }
    })

}

module.exports = router;