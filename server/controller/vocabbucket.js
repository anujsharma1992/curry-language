var express = require('express'),
    router = express.Router();
var Vocabbucket = require('../models/vocabbucket');
var Bucketcategory = require('../models/bucketcategory');
var Language = require('../models/language');

router.post('/add-bucket', function (req, res) {
    var translate_word;
    var vocabbucketObj = new Vocabbucket();
    vocabbucketObj.cat_id = req.body.cat_id;
    vocabbucketObj.title = req.body.title;
    vocabbucketObj.word = req.body.word;
    vocabbucketObj.description = req.body.description;
    var languageData = req.body.languageData ? JSON.parse(req.body.languageData):'';
    var langObj =[];
    if(req.body.languageData){
         for (i = 0; i < languageData.length; i++) {
            let obj = {};
            obj.language_id = languageData[i].language_id;
            obj.language = languageData[i].language;
            obj.image = languageData[i].req.files['image']
            // if (req.files && req.files['image']) {
            //     obj.image = typeof languageData[i].req.files != 'undefined' && typeof languageData[i].req.files['image'] != 'undefined' && languageData[i].req.files['image'].length ? languageData[i].req.files['image'][0].filename : '';
            // } else {
            // }
            langObj.push(obj);  
        }
    }
    vocabbucketObj.translate_word = langObj;
    // if (req.files && req.files['audio']) {
    //     vocabbucketObj.audio = typeof req.files != 'undefined' && typeof req.files['audio'] != 'undefined' && req.files['audio'].length ? req.files['audio'][0].filename : '';
    // } else {
    //     vocabbucketObj.audio = '';
    // }
    if (req.files && req.files['image']) {
        vocabbucketObj.image = typeof req.files != 'undefined' && typeof req.files['image'] != 'undefined' && req.files['image'].length ? req.files['image'][0].filename : '';
    } else {
        vocabbucketObj.image = '';
    }   
    
    vocabbucketObj.save(function (err, data) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(201).json({"Data":data, "message": "success", "error_code": "200" });
            console.log(data)
        }
    })
})

router.post('/fetch-vocab-bucket', function (req, res) {
    Vocabbucket.find({"_id": req.body._id},function (err, bucket) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": bucket, "message": "success", "error_code": "200" });
        }
    })
})


router.post('/fetch-vocab-bucket-cat-by-id', function (req, res) {
    if(req.body.cat_id && req.body.language_id){
    Vocabbucket.find({ "cat_id": req.body.cat_id,"translate_word.language_id" :req.body.language_id })
    .populate({
        path: 'cat_id',
        select: 'name',
    }).exec(function (err, Data) {
        //console.log(Data[0].translate_word[0],"AAA")
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            object = {
                language_id:Data[0].translate_word,
                
            }
            for (var i = 0; i < object.length; i++){
                obj = {}
                obj.language_id = object[i].language_id
              console.log(obj,">>>>>>>>>")
               object.push(obj)
            }
            
            res.status(200).json({ "data": Data[0].object, "message": "success", "error_code": "200" });
    }
    })
}
})

// router.post('/fetch-vocab-bucket-cat-by-id',function(req, res){
//     if(req.body.cat_id && req.body.language_id){
//         Vocabbucket.find({"cat_id":req.body.cat_id},{"translate_word.language_id": "5a67544ac0573e1d76a9df29"},
//         function(err,docs){
//             console.log(docs)
//             res.send(docs,{data:docs});
//     });

//     }
// })


router.post('/delete-vocab', function (req, res) {
    if(req.body._id){
        Vocabbucket.find({"_id":req.body._id},function(err,data){
            if(err){
            res.status(200).json(err)
            }else{
                if(data && data.length>0){
                    Vocabbucket.remove({ "_id": req.body._id }, function (err, data) {
                    if (err) {
                    res.status(500).json({ "error_code": "500", "message": err });
                    } else {
                    res.status(200).json({"error_code": "200","message": "vocabbucket has been deleted." }) }
                    }) 
                }else{
                    return res.status(500).json({"message": "Cant delete, vocabbucket not exists.", "error_code": "500" });
                }
            }
        })
    }
})

//vocab edit-vocbbucket Ambuj
router.post('/edit-vocabbucket', function (req, res) {
    if (req.body._id) {
        Vocabbucket.findOne({ "_id": req.body._id }, function (err, vocab) {
            if (err) {
                res.status(500).json({ "error_code": "500", "message": "vocab id not exist.","error":err});
            } else {
                if (vocab) {
                    vocab.title = req.body.title || vocab.title;
                    vocab.description = req.body.description || vocab.description;
                    vocab.word = req.body.word || vocab.word;
                    if (req.files && req.files['image']) {
                        vocab.image = typeof req.files != 'undefined' && typeof req.files['image'] != 'undefined' && req.files['image'].length ? req.files['image'][0].filename : '';
                    }
                    vocab.translate_word = JSON.parse(req.body.languageData);
                    vocab.save(function (err, vocabObj) {
                        if (err) {
                            res.status(500).json({ "error_code": "500", "message": err });
                        } else {
                            res.status(201).json({ "data": vocabObj, "message": "success", "error_code": "200" }); 
                        }
                    
                    })
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
    }

})
// router.get('/fetch-fluencies', function (req, res) {
//     Fluency.find({ "is_active": true }, function (err, data) {
//         if (err) {
//             res.status(500).json({ "error_code": "500", "message": err });
//         } else {
//             res.status(200).json({ "data": data, "message": "success", "error_code": "200" });
//         }
//     })
// })
// router.post('/delete-vocab-cat', function (req, res) {
  
//     if(req.body.cat_id){
//         Bucketcategory.find({"_id":req.body.cat_id},function(err,data){
//             if(err){
//             res.status(200).json(err)
//             }else{
//                 if(data && data.length>0){
//                     Bucketcategory.remove({ "_id": req.body.cat_id }, function (err, data) {
//                     if (err) {
//                     res.status(500).json({ "error_code": "500", "message": err });
//                     } else {
//                     res.status(200).json({"error_code": "200","message": "category has been deleted." }) }
//                     }) 
//                 }else{
//                     return res.status(500).json({"message": "Cant delete, category not exists.", "error_code": "500" });
//                 }
//             }
//         })
//     }
// })

// router.post('/edit-vocab-cat', function (req, res) {

//     if (req.body.cat_id) {
//         Bucketcategory.findOne({ "_id": req.body.cat_id }, function (err, cat) {
//             if (err) {
//                 res.status(500).json({ "error_code": "500", "message": "bucket id not exist.","error":err});
//             } else {
//                 if (cat) {
//                     cat.title = req.body.title || cat.title;
//                     if (req.files && req.files['image']) {
//                         cat.image = typeof req.files != 'undefined' && typeof req.files['image'] != 'undefined' && req.files['image'].length ? req.files['image'][0].filename : '';
//                     }
//                     cat.save(function (err, chapter) {
//                         if (err) {
//                             res.status(500).json({ "error_code": "500", "message": err });
//                         } else {
//                             res.status(201).json({ "data": chapter, "message": "success", "error_code": "200" });                            
//                         }
//                     })
//                 }
//             }
//         })
//     } else {
//         res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
//     }
    
// })
//vocab-bucket fatch by cat_id Ambuj
// router.post('/fetch-vocab-bucket-cat-by-id', function (req, res) {
//     Vocabbucket.find({ "cat_id": req.body.cat_id })
//     .populate('cat_id').exec(function(err,data){
//         console.log(req.body.cat_id)
//         if (err) {
//             res.status(500).json({ "error_code": "500", "message": err });
//         } else {
//             res.status(200).json({ "data": bucket.cat_id, "message": "success", "error_code": "200" });
//         }
//     })
// })

//vocab-bucket fatch by cat_id Ambuj
// router.post('/fetch-vocab-cat-by-id', function (req, res) {
//     Bucketcategory.find({ "cat_id": req.body.cat_id },function (err, category) {
//         if (err) {
//             res.statuVocabbuckets(500).json({ "error_code": "500", "message": err });
//         } else {
//             res.status(200).json({ "data": category, "message": "success", "error_code": "200" });
//         }
//     })
// })
module.exports = router;