var express = require('express'),

    mongoose = require('mongoose');
router = express.Router();

var UserScore = require('../models/userScore');


router.post('/save-user-score', function (req, res) {
    if (req.body.user_id && req.body.chapter_id && req.body.score && req.body.course_id) {
        var userScore = new UserScore()
        userScore.user = req.body.user_id,
            userScore.chapter = req.body.chapter_id,
            userScore.course = req.body.course_id,
            userScore.score = req.body.score
            UserScore.findOne({"user":req.body.user_id,"chapter":req.body.chapter_id},function(err,data){
                if(data){
                    console.log(data,'chapter data...');
                    UserScore.remove({"_id":data._id},function(err){
                        //res.status(200).json({ "error_code": "200", "message": "success"});
                    })

                }
                userScore.save(function (err, doc) {
                    if (err) {
                        res.status(500).json({ "error_code": "500", "message": err });
                    } else {
                        res.status(200).json({ "error_code": "200", "message": doc });
                    }
                })
            })

    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params" });
    }
})

module.exports = router;
