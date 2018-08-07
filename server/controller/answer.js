var express = require('express'),
    router = express.Router();

var Answer = require('../models/answer');
var Question = require('../models/question');

router.post("/add-answer", function (req, res) {
    if (req.body.title && req.body.is_correct && req.body.question_id) {
        var answerObj = new Answer();
        answerObj.title = req.body.title;
        answerObj.is_correct = req.body.is_correct;
        answerObj.question_id = req.body.question_id;
        if (req.files && req.files['ansImage']) {
            answerObj.image = typeof req.files != 'undefined' && typeof req.files['ansImage'] != 'undefined' && req.files['ansImage'].length ? req.files['ansImage'][0].filename : '';
        } else {
            answerObj.image = '';
        }
        if (req.files && req.files['ansAudio']) {
            answerObj.audio = typeof req.files != 'undefined' && typeof req.files['ansAudio'] != 'undefined' && req.files['ansAudio'].length ? req.files['ansAudio'][0].filename : '';
        } else {
            answerObj.audio = '';
        }
        answerObj.save(function (err, answer) {
            if (err) {
                res.status(500).json({ "data": err })
            } else {
                Question.findOne({ "_id": answer.question_id }, function (err, question) {
                    question.options.push(answer._id);
                    question.save(function (err, doc) {
                        res.status(201).json({ "data": answer, "message": "success", "error_code": "200" });
                    })
                })
            }
        })
    } else {
        res.status(500).json({ "error_code": "707", "message": "Incomplete params" });
    }
})

router.get("/fetch-answers", function (req, res) {
    Answer.find({}, function (err, doc) {
        if (err) {
            res.send(err);
        } else {
            res.send(doc);
        }
    })
})

router.post('/update-answer', function (req, res) {
    if (req.body.answer_id) {
        Answer.findOne({ "_id": req.body.answer_id }, function (err, answer) {
            if (err) {
                res.status(500).json({ "error_code": "500", "message": err });
            } else {
                if (answer) {
                    answer.title = req.body.title || answer.title;
                    answer.vocab_count = req.body.vocab_count || answer.vocab_count;
                    answer.question_id=answer.question_id;
                    if (req.files && req.files['ansImage']) {
                        answer.image = typeof req.files != 'undefined' && typeof req.files['ansImage'] != 'undefined' && req.files['ansImage'].length ? req.files['ansImage'][0].filename : '';
                    } else {
                        answer.image = answer.image;
                    }
                    if (req.files && req.files['ansAudio']) {
                        answer.audio = typeof req.files != 'undefined' && typeof req.files['ansAudio'] != 'undefined' && req.files['ansAudio'].length ? req.files['ansAudio'][0].filename : '';
                    } else {
                        answer.audio = answer.audio;
                    }
                    answer.save(function (err, answer) {
                        if (err) {
                            res.status(500).json({ "error_code": "500", "message": err });
                        } else {
                            res.status(200).json({ "data": answer, "message": "success", "error_code": "200" });
                        }
                    })
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
    }

})


module.exports = router;