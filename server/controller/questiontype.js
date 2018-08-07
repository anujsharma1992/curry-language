var express = require('express'),
    router = express.Router();

var QuestionType = require('../models/questiontype');
var Chapter = require('../models/chapter');

router.post('/add-questiontype', function (req, res) {
    if (req.body.title) {
        var questionTypeObj = new QuestionType();
        questionTypeObj.title = req.body.title;
        questionTypeObj.save(function (err, questionType) {
            if (err) {
                res.status(500).json({ "error_code": "500", "message": err });
            } else {
                res.status(201).json({"message": "success", "error_code": "200" });                
                // Chapter.findOne({ "_id": req.body.chapter_id }, function (err, chapter) {
                //     chapter.questions_types.push(questionType._id);
                //     chapter.save(function (err, doc) {
                //         res.status(201).json({ "data": questionType, "message": "success", "error_code": "200" });
                //     })
                // })
            }
        })
    } else {
        res.status(500).json({ "error_code": "707", "message": "Incomplete params" });
    }
})

router.get('/fetch-questiontypes', function (req, res) {
    QuestionType.find({ "is_active": true }, function (err, questionType) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": questionType, "message": "success", "error_code": "200" });
        }
    })
})

module.exports = router;