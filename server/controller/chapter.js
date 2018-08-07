var express = require('express'),
    router = express.Router();
let async = require('async');
var Chapter = require('../models/chapter');
var Course = require('../models/course');
var Userscore = require('../models/userScore');
var Vocabwords = require('../models/vocabwords');


router.post('/fetch-chapter-by-id', function (req, res) {
    Chapter.find({ "_id": req.body.chapter_id }).populate({
        path: 'questiontypes',
        select: '_id title',
    }).exec(function (err, courses) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {

            res.status(200).json({ "data": courses, "message": "success", "error_code": "200" });
        }
    })
})

router.post('/fetch-unlock-bucket', function (req, res) {
    Userscore.find({"user":req.body.user_id}).select('score').populate({
        path: 'chapter',select:'buckets'
    }).exec(function(err,data){
        if(err){
             res.status(500).json({ "error_code": "500", "message": err });
        }else{
            console.log(JSON.stringify(data,'user data....'));
            var bucket_data = [];
            data.forEach(function(d,i){
                if(d.chapter && d.chapter.buckets){
                    bucket_data.push(d.chapter.buckets);
                }
            })                
            console.log(data);
            res.status(200).json({ "data": bucket_data, "message": "success", "error_code": "200" });
        }
    })                    

})


// router.post('/fetch-unlock-bucket', function (req, res) {
//     Course.find({ "is_active": true}).select('name').populate({
//         path: 'chapters',select: '_id buckets'
//     }).exec(function (err, data) { 
//         if (err) {
//             res.status(500).json({ "error_code": "500", "message": err });
//         } else {
//             var bucket_data = [];
//             if(data && data.length>0){
//                 var chapter_ids = [];
//                 for(j=0;j<data.length;j++){
//                     data[j].chapters.forEach(function(item,i){
//                         Userscore.find({"chapter":item._id,"user":req.body.user_id}).exec(function(err,data2){
//                             if(data2){
//                                 bucket_data.push(item.buckets[0]);
//                             }
//                             if(data[j] && data[j].chapters){
//                                 if(j==data.length && data[j].chapters.length==i+1){
//                                     res.status(200).json({ "data": bucket_data, "message": "success", "error_code": "200" });                            
//                                     return;
//                                 }                                    
//                             }
//                             else{
//                                 if(j==data.length){
//                                     res.status(200).json({ "data": bucket_data, "message": "success", "error_code": "200" });                            
//                                     return;
//                                 }                                    
                                
//                             }
//                         })                    
                        
                    
//                     })
//                 }
//             }else{
//                 res.status(200).json({ "data": [], "message": "success", "error_code": "200" });
    
//             }
//         }
//     })
// })


router.post('/fetch-chapter-questions', function (req, res) {

    Chapter.findOne({ "_id": req.body.chapter_id }).select('name _id').
    populate({
        path: 'questions', select: 'question_title question_image is_header question_audio options _id',
        populate: {
            path: 'question_type', select: 'title _id'
        }
    }).
    exec(function (err, data) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            if(data){
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
            res.status(200).json({ "data": main_data, "message": "success", "error_code": "200" });
        
    }else{
        res.status(200).json({ "data": [], "message": "success", "error_code": "200" });
        
    }
    }
    })



    // Chapter.find({ "_id": req.body.chapter_id }).populate({
    //     path: 'questiontypes',
    //     select: '_id title',
    // }).exec(function (err, courses) {
    //     if (err) {
    //         res.status(500).json({ "error_code": "500", "message": err });
    //     } else {

    //         res.status(200).json({ "data": courses, "message": "success", "error_code": "200" });
    //     }
    // })
})









////////////////////////////////////////////////////////////////////////
///////////////////////// ADMIN PANEL APIs ////////////////////////////
///////////////////////////////////////////////////////////////////////

router.post('/add-chapter', function (req, res) {
    if (req.body.name && req.body.course_id) {
        var chapterObj = new Chapter();
        chapterObj.name = req.body.name;
        chapterObj.course_id = req.body.course_id;
        chapterObj.description = req.body.description;
        chapterObj.gems = req.body.gems;
        
        if (req.files && req.files['avatar']) { // chapter image
            chapterObj.image = typeof req.files != 'undefined' && typeof req.files['avatar'] != 'undefined' && req.files['avatar'].length ? req.files['avatar'][0].filename : '';
        } else {
            chapterObj.image = '';
        }
        // code to push bucket in same chapter...
        var curObj = {};
        if (req.files && req.files['bucket_image']) { // bucket image
            curObj.bucket_image = typeof req.files != 'undefined' && typeof req.files['bucket_image'] != 'undefined' && req.files['bucket_image'].length ? req.files['bucket_image'][0].filename : '';
        } else {
            curObj.bucket_image = '';
        }  
        curObj.bucket_words = req.body.bucket_words ?  req.body.bucket_words : '';
        curObj.english_words = req.body.english_words ?  req.body.english_words : '';
        curObj.bucket_title = req.body.bucket_title ?  req.body.bucket_title : '';
        chapterObj.buckets = curObj;
        chapterObj.save(function (err, chapter) {
            if (err) {
                res.status(500).json({ "error_code": "500", "message": err });
            } else {
                Course.findOne({ "_id": chapter.course_id }, function (err, course) {
                    course.chapters.push(chapter._id);
                    course.save(function (err, doc) {
                        
                            res.status(201).json({ "data": chapter, "message": "success", "error_code": "200" });
                    })
                })

            }
        })
    } else {
        res.status(500).json({ "error_code": "707", "message": "Incomplete params" });
    }
})

router.post('/delete-chapter', function (req, res) {
    Chapter.remove({"_id":req.body.chapter_id}, function (err, chapter) {
        if (!err) {
            if(chapter){
                Course.findOneAndUpdate({}, 
                    {$pull: {chapters:  req.body.chapter_id}}, 
                    {multi: true},function(err,data){
                        if (err) {
                            res.status(500).json({ "error_code": 500, "message": err });
                        } else {
                            res.status(200).json({ "data": data, "message": "success", "error_code": 200 });
                        console.log(data,"<<<<<<<<<<")
                        }
                    }
                );
            }
            else{
                res.status(500).json({ "error_code": 500, "message": "Invalid chapter id" });
            }
        } else {
            res.status(500).json({ "error_code": 500, "message": err });
        }
    })
})

router.post('/delete-chapter-empty', function (req, res) {
    if(req.body.chapter_id){
        Chapter.find({"_id":req.body.chapter_id},function(err,data){
            if(err){
                res.status(200).json(err)
            }else{
            
            if(data[0].questions.length == 0){
                Chapter.remove({ "_id": req.body.chapter_id }, function (err, data) {
                    if (err) {
                        res.status(500).json({ "error_code": "500", "message": err });
                    } else {
                        res.status(200).json({"message": "Chapter has been deleted." })                    }
                }) 
            }else{
            return  res.status(500).json({ "data": data, "message": "Can't delete, question exists under this chapter.", "error_code": "500" });
        }
        }
    })
    }
})    

router.get('/fetch-chapters', function (req, res) {
    Chapter.find({ "is_active": true }).populate({
        path: 'course_id',
        select: 'name',
    }).exec(function (err, courses) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": courses, "message": "success", "error_code": "200" });
        }
    })
})

router.post('/fetch-chapters-by-course', function (req, res) {
    var obj = { "course_id": req.body.course_id };
    console.log(obj);
    Chapter.find({ "course_id": req.body.course_id }).populate({
        path: 'course_id',
        select: 'name',
    }).exec(function (err, courses) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": courses, "message": "success", "error_code": "200" });
        }
    })
})

router.post('/add-vocab-words', function (req, res) {
    if (req.body.chapter_id) {
        var vocabObject = new Vocabwords();
        vocabObject.title = req.body.title
        if (req.files && req.files['img']) {
            vocabObject.image = typeof req.files != 'undefined' && typeof req.files['img'] != 'undefined' && req.files['img'].length ? req.files['img'][0].filename : '';
        } else {
            vocabObject.image = '';
        }
        if (req.files && req.files['audio']) {
            vocabObject.audio = typeof req.files != 'undefined' && typeof req.files['audio'] != 'undefined' && req.files['audio'].length ? req.files['audio'][0].filename : '';
        } else {
            vocabObject.audio = '';
        }
        vocabObject.save(function (err, voca) {
            Chapter.findOne({ "_id": req.body.chapter_id }, function (err, chapter) {
                chapter.vocab_Words.push(voca._id);
                chapter.save(function (err, chapter) {
                    res.status(200).json({ "message": "success", "error_code": "200", "data": chapter });
                })
            })
        })
    } else {
        res.status(200).json({ "message": "Incomplete Params", "error_code": "707" });
    }
})

router.post('/fetch-vocab-words', function (req, res) {
    let finalAudio =[];
    if (req.body.chapter_id) {
        Chapter.findOne({ "_id": req.body.chapter_id }).select('questions').populate({
            path: 'questions',
            select: 'question_audio options',
        }).exec(function (err, chapter) {
            if(chapter==null || chapter.toString()==""){
                res.status(200).json({"message": "chapter not available.", "error_code": "402" });    
                return;                
            }
            //console.log(chapter,'fetched chapters........');
            var finalObject = [];
            for(const prop in chapter.questions){
                if(chapter.questions[prop].question_audio){
                    finalObject.push(chapter.questions[prop].question_audio);
                }
            //   for(const prop1 in chapter.questions[prop].options){
            //     if(chapter.questions[prop].options[prop1].audio){
            //         finalObject.push(chapter.questions[prop].options[prop1].audio);
            //     }
            //   }
              //console.log(a.questions[prop].question_audio);  
            }
            res.status(200).json({ "data": finalObject, "message": "success", "error_code": "200" });
        })
    } else {
        res.status(200).json({ "message": "Incomplete Params", "error_code": "402" });
    }
})

router.post('/edit-chapter', function (req, res) {
    if (req.body.chapter_id) {
        Chapter.findOne({ "_id": req.body.chapter_id }, function (err, chapter) {
            if (err) {
                res.status(500).json({ "error_code": "500", "message": "chapter id not exist.","error":err});
            } else {
                if (chapter) {
                    chapter.name = req.body.name || chapter.name;
                    chapter.gems = req.body.gems || chapter.gems;
                    chapter.description = req.body.description || chapter.description;
                    chapter.course_id = req.body.course_id || chapter.course_id;
                    if (req.files && req.files['avatar']) {
                        chapter.image = typeof req.files != 'undefined' && typeof req.files['avatar'] != 'undefined' && req.files['avatar'].length ? req.files['avatar'][0].filename : '';
                    } 
                    var curObj = {};
                    if (req.files && req.files['bucket_image']) {
                        curObj.bucket_image = typeof req.files != 'undefined' && typeof req.files['bucket_image'] != 'undefined' && req.files['bucket_image'].length ? req.files['bucket_image'][0].filename : '';
                    } else {
                        curObj.bucket_image = req.body.old_bucket_image;
                    }
                    curObj.english_words = '';
                    curObj.bucket_words = req.body.bucket_words ?  req.body.bucket_words : '';
                    curObj.bucket_title = req.body.bucket_title ?  req.body.bucket_title : '';
                    curObj.english_words = req.body.english_words ?  req.body.english_words : '';
                    chapter.buckets = curObj;
                    console.log(curObj,'bucket image...');
                    chapter.save(function (err, chapter) {
                        if (err) {
                            res.status(500).json({ "error_code": "500", "message": err });
                        } else {
                            res.status(201).json({ "data": chapter, "message": "success", "error_code": "200" });
                            
                            // Course.findOne({ "_id": chapter.course_id }, function (err, course) {
                            //     course.chapters.push(chapter._id);
                            //     course.save(function (err, doc) {
                            //             res.status(201).json({ "data": chapter, "message": "success", "error_code": "200" });
                            //     })
                            // })
                        }
                    })
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
    }

})


router.post('/get-chapter-by-id', function (req, res) {
    if(req.body.chapter_id){
        Chapter.findById({ "_id": req.body.chapter_id }, function (err, chapter) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": chapter, "message": "success", "error_code": "200" });
        }
    })
}
else{
    res.status(200).json({ "message": "Incomplete params", "error_code": "403" });
}
})
module.exports = router;