var express = require('express'),
    async = require("async");

router = express.Router();

var Question = require('../models/question');
//var Option = require('../models/option');
var Chapter = require('../models/chapter');
var QuestionType = require('../models/questiontype');


/*********************************************************
 *   ADMIN PANEL APIS
 *********************************************************/
router.post('/add-chapter-question', function (req, res) {
    if (req.body.question_title && req.body.question_type && req.body.chapter_id) {
        var question = new Question();
        question.question_title = req.body.question_title;
        question.is_header = req.body.is_header? JSON.parse(req.body.is_header):false;
        question.chapter_id = req.body.chapter_id;
        question.question_image = req.files['question_image']? req.files['question_image'][0].filename :'';
        question.question_audio = req.files['question_audio']?req.files['question_audio'][0].filename:'';
        question.question_type = req.body.question_type;

        // code to bind options to push
        if (req.body.option_length !== undefined && req.body.option_length > 0) {
            var option_title = req.body.option_title ? JSON.parse(req.body.option_title):'';
            var option_is_correct = JSON.parse(req.body.is_true);
            var option_blanks = req.body.blanks?JSON.parse(req.body.blanks) : '';
            var savedOptions = []; 
            var k = 0;
            for (i = 0; i < req.body.option_length; i++) {              
                var option = {};
                option.title = option_title[i];
                option.image = "";
                option.audio = "";
                if(req.body.question_type=="5a70031d581bf44a25df5263" || req.body.question_type=="5a700376581bf44a25df5265" || req.body.question_type=="5a815c40828eb71d68c7b604"){
                    // code to count the number of blanks...
                    var blank_count = (option_blanks[i].match(/___/g) || []).length;
                    for(j=0;j<blank_count;j++){
                        if(j<blank_count){
                            var comma = ','
                        }
                        var coma = j<blank_count-1? "," : "";
                        option.image+= req.files[`option_image`]? req.files[`option_image`][k].filename+coma:'';
                        option.audio+= req.files[`option_audio`]? req.files[`option_audio`][k].filename+coma:'';
                        k++;
                    }
                    option.image.replace(/(^,)|(,$)/g, "");
                    option.audio.replace(/(^,)|(,$)/g, "");
                }else{
                    option.image = req.files[`option_image`] ? req.files[`option_image`][i].filename:'';
                    option.audio = req.files[`option_audio`] ? req.files[`option_audio`][i].filename :'';
                }
                option.blanks = option_blanks ? option_blanks[i] :'';
                option.is_correct = option_is_correct[i] && option_is_correct[i] == true ? option_is_correct[i] : false;
                option.is_active = true;
                //option.is_header = option_is_header;
                savedOptions.push(option);                
            }
        }
        question.options = savedOptions;
        question.save(function (err, quesObj) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            Chapter.update({"_id":req.body.chapter_id},{$push:{questions:quesObj._id}},function(err,reslt){
                
                if(err){
                    res.status(500).json({ "error_code": "500", "message": err });                    
                }
                res.status(200).json({ "error_code": "200", "message": "question added successfully!!","data":quesObj });                
                
            })
            
        }
        })
    } else {
        res.status(500).json({ "error_code": "707", "message": "Incomplete params" });
    }
})

router.post("/fetch-questions-by-id", function (req, res) {
    if (req.body.question_id) {
        Question.find({ "_id": req.body.question_id },function (err, data) {
            if (err) {
                res.json(err);
            } else {
                res.status(200).json({ "error_code": "200", "message": "success","data":data });
            }
        })

    }
    else{
        res.status(500).json({ "error_code": "707", "message": "Incomplete params" });
    }
});




// DUMMY APIS...
// router.post('/add-question-answer', function (req, res) {
//     if (req.body.name && req.body.chapter_id) {
//         var question = new Question();
//         question.question_title = req.body.name;
//         question.chapter_id = req.body.chapter_id;
//         question.question_image = req.files['QuestionImage'][0].filename
//         question.question_audio = req.files['QuestionAudio'][0].filename
//         question.question_type = req.body.question_type;
//         question.save(function (err, quesObj) {
//             if (err) {
//                 res.status(500).json({ "error_code": "500", "message": err });
//             } else {
//                 if (req.body.option_length !== undefined && req.body.option_length > 0) {
//                     var savedOptions = [];
//                     for (i = 0; i < req.body.option_length; i++) {
//                         var answer = new Answer();
//                         answer.title = req.body.option_title[i]
//                         answer.image = req.files[`ansImage[${i}]`][0].filename
//                         answer.audio = req.files[`ansAudio[${i}]`][0].filename
//                         answer.is_correct = req.body.is_true[i] && req.body.is_true[i] == true ? req.body.is_true[i] : false
//                         answer.question = quesObj._id;
//                         answer.save(function (err, ans) {
//                             savedOptions.push(ans._id);
//                             if (i == req.body.option_length - 1) {
//                                 console.log(savedOptions.length);
//                                 saveAnswersInQuestion(quesObj, savedOptions, function (err, data) {
//                                     if (err) {
//                                         res.status(500).json({ "error_code": "500", "message": err });
//                                     } else {
//                                         res.status(200).json({ "error_code": "200", "message": data });
//                                     }
//                                 })
//                             }
//                         });
//                     }
//                 }
//             }
//         })
//     } else {
//         res.status(500).json({ "error_code": "707", "message": "Incomplete params" });
//     }
// })

// function saveAnswersInQuestion(QueObj, SavedAnswers, cb) {
//     Question.findOne({ "_id": QueObj._id }, function (err, data) {
//         if (err) {
//             cb(err, null);
//         } else {
//             for (var i = 0; i < SavedAnswers.length; i++) {
//                 data.options.push(SavedAnswers[i]);
//                 if (i == SavedAnswers.length - 1) {
//                     data.save(function (err, doc) {
//                         if (err) {
//                             cb(err, null);
//                         } else {
//                             cb(null, data);
//                         }
//                     })
//                 }
//             }

//         }
//     })
// }

// router.post("/add-questions", function (req, res) {
//     if (req.body.question_title && req.body.question_type_id) {
//         var questionObj = new Question();
//         questionObj.question_title = req.body.question_title;
//         questionObj.vocab_count = req.body.vocab_count;
//         questionObj.question_type = req.body.question_type_id;
//         if (req.files && req.files['QuestionImage']) {
//             questionObj.question_image = typeof req.files != 'undefined' && typeof req.files['QuestionImage'] != 'undefined' && req.files['QuestionImage'].length ? req.files['QuestionImage'][0].filename : '';
//         } else {
//             questionObj.question_image = '';
//         }
//         if (req.files && req.files['QuestionAudio']) {
//             questionObj.question_audio = typeof req.files != 'undefined' && typeof req.files['QuestionAudio'] != 'undefined' && req.files['QuestionAudio'].length ? req.files['QuestionAudio'][0].filename : '';
//         } else {
//             questionObj.question_audio = '';
//         }
//         questionObj.save(function (err, question) {
//             if (err) {
//                 res.status(500).json({ "data": err })
//             } else {
//                 QuestionType.findOne({ "_id": question.question_type }, function (err, questiontype) {
//                     questiontype.questions.push(question._id);
//                     questiontype.save(function (err, data) {
//                         res.status(201).json({ "data": question, "message": "success", "error_code": "200" });
//                     })
//                 })
//             }
//         })
//     } else {
//         res.status(500).json({ "error_code": "707", "message": "Incomplete params" });
//     }
// })

// router.get("/fetch-questions", function (req, res) {
//     Question.find({}, function (err, doc) {
//         if (err) {
//             res.send(err);
//         } else {
//             res.send(doc);
//         }
//     })
// })


// router.post('/update-question', function (req, res) {
//     if (req.body.question_id) {
//         Question.findOne({ "_id": req.body.question_id }, function (err, question) {
//             if (err) {
//                 res.status(500).json({ "error_code": "500", "message": err });
//             } else {
//                 if (question) {
//                     question.question_title = req.body.question_title || question.question_title;
//                     question.vocab_count = req.body.vocab_count || question.vocab_count;
//                     if (req.files && req.files['QuestionImage']) {
//                         question.question_image = typeof req.files != 'undefined' && typeof req.files['QuestionImage'] != 'undefined' && req.files['QuestionImage'].length ? req.files['QuestionImage'][0].filename : '';
//                     } else {
//                         question.question_image = question.question_image;
//                     }
//                     if (req.files && req.files['QuestionAudio']) {
//                         question.question_audio = typeof req.files != 'undefined' && typeof req.files['QuestionAudio'] != 'undefined' && req.files['QuestionAudio'].length ? req.files['QuestionAudio'][0].filename : '';
//                     } else {
//                         question.question_audio = question.question_audio;
//                     }
//                     question.save(function (err, question) {
//                         if (err) {
//                             res.status(500).json({ "error_code": "500", "message": err });
//                         } else {
//                             res.status(200).json({ "data": question, "message": "success", "error_code": "200" });
//                         }
//                     })
//                 }
//             }
//         })
//     } else {
//         res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
//     }

// })

router.post('/delete-question', function (req, res) {
    Question.findByIdAndRemove(req.body.question_id, function (err, chapter) {
           if (!err) {
               if(chapter){
                   Chapter.update({ "_id": Question.question_id },
                   { $pull: { questions: req.body.question_id } },
                   function (err, numberAffected) {
                       if (err) {
                           res.status(500).json({ "error_code": 500, "message": err });
                       } else {
                           res.status(200).json({ "data":[], "message": "success", "error_code": 200 });
                       }
                   });
               }
               else{
                   res.status(500).json({ "error_code": 500, "message": "Invalid question id" });
               }
           } else {
               res.status(500).json({ "error_code": 500, "message": err });
           }
       })
   })
   

module.exports = router;