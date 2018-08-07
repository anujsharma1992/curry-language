var express = require('express'),
    router = express.Router();
var  Try = require('../models/try');


router.post('/add-try', function (req, res) {
console.log(req.body)
    var TryObj = new Try();
    TryObj.word = req.body.word;
    var languageData = req.body.languageData;
    var langObj =[];
    if(req.body.languageData){
        for (i = 0; i < req.body.option_length; i++) {
            let obj = {};
            obj.language_id = languageData[i].language_id;
            obj.language = languageData[i].language;
            langObj.push(obj);  
        }
    }
    TryObj.translate_word = langObj;
    console.log(TryObj,'inset obj');
    if (req.files && req.files['image']) {
        TryObj.image = typeof req.files != 'undefined' && typeof req.files['image'] != 'undefined' && req.files['image'].length ? req.files['image'][0].filename : '';
    } else {
        TryObj.image = '';
    }   
    TryObj.save(function (err, data) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(201).json({"Data":data, "message": "success", "error_code": "200" });
        }
    })
})

module.exports = router;