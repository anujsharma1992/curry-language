var express = require('express'),
    router = express.Router();
    var async = require('async');
    //var sync = require('sync');
var Course = require('../models/course');
var Chapter = require('../models/chapter');
var UserScore = require('../models/userScore');
var Language = require('../models/language');


router.post('/add-course', function (req, res){
    if (req.body.name && req.body.language_id && req.body.language_id) {
        var courseObj = new Course();
        courseObj.name = req.body.name;
        courseObj.language_id = req.body.language_id;
        courseObj.desc = req.body.desc;
        courseObj.course_type = req.body.course_type;
        if (req.files && req.files['avatar']) {
            courseObj.image = typeof req.files != 'undefined' && typeof req.files['avatar'] != 'undefined' && req.files['avatar'].length ? req.files['avatar'][0].filename : '';
        } else {
            courseObj.image = '';
        }
        courseObj.save(function (err, course) {
            if (err) {
                res.status(500).json({ "error_code": 500, "message": err });
            } else {
                Language.findOne({ "_id": course.language_id }, function (err, language) {
                    console.log(language,'test test');
                    language.courses.push(course._id);
                    language.save(function (err, doc) {
                        res.status(201).json({ "data": course, "message": "success", "error_code": 200 });
                    })
                })
            }
        })
    } else {
        res.status(500).json({ "error_code": 707, "message": "Incomplete params" });
    }
})


router.get('/fetch-courses', function (req, res) {
    if(!req.query.user_id){
        res.status(500).json({ "error_code": "707", "message": "Incomplete params" });
    }
    Course.find({"course_type":"main"}).select('_id name chapters desc is_active').exec(function (err, courses) {
        var result =[];
        var i = 0;
        if (err) {
            res.status(500).json({ "error_code": 500, "message": err });
        } else {

            var i = 0;
				
            var loopArray = function(arr) {
                customAlert(arr[i],function(){
                    i++;
                    if(i < arr.length) {
                        loopArray(arr);   
                    }
                }); 
            }

            function customAlert(msg,callback) {
                if(msg){
                    var gems=0;
                    data = {};
                    UserScore.find({ "course": msg._id,"user":req.query.user_id }).populate({
                        path: 'chapter',select:'name gems _id'
                    }).exec(function (err, data) {
                        console.log(data,'chapter data');
                    for(d in data){
                        console.log(d,'iteration data...');
                        gems = data[d].chapter?gems +parseInt(data[d].chapter.gems):0;
                    }

                    var total_gems = 0;
                    Chapter.find({ "course_id": msg._id},function (err, chapters) {
                        if(chapters.length>0){
                        for(l=0;l<chapters.length;l++){
                        console.log(l,'iteration data...',chapters[l].gems);
                        total_gems = total_gems +parseInt(chapters[l].gems);
                    }
               }
                   var obj = {}
                   obj.name = msg.name;
                   obj.course_id = msg._id;
                   obj.desc = msg.desc;                
                   obj.total_chapter = msg.chapters ? msg.chapters.length:0;
                   obj.is_active = data.length>0 || i==0 ?true:false;
                   obj.attempt_chapter = data ? data.length:0;
                   obj.gems = parseInt(gems?gems:0);  
                   obj.total_gems = total_gems? total_gems:0;
                   result.push(obj);
                   console.log(gems);  
                   
                   if(i==courses.length-1){
                       res.status(200).json({ "error_code": 200, "data": result });
                       return;
                   }
                   callback();                    
                })
                //     var obj = {}
                //     obj.name = msg.name;
                //     obj.course_id = msg._id;
                //     obj.desc = msg.desc;                
                //     obj.total_chapter = msg.chapters ? msg.chapters.length:0;
                //     obj.is_active = data.length>0 || i==0 ?true:false;
                //     obj.attempt_chapter = data ? data.length:0;
                //     obj.gems = parseInt(gems?gems:0);  
                //     result.push(obj);
                //     console.log(gems);  
                    
                //     if(i==courses.length-1){
                //         res.status(200).json({ "error_code": 200, "data": result });
                //         return;
                //     }
                //     callback();
                 })
            }
        }
            loopArray(courses);
//             var iterateGems = function(arr) {
//                 getGems(arr[i],function(){
//                     i++;
//                     if(i < arr.length) {
//                         getGems(arr);   
//                     }
//                 }); 
//             }
                //res.status(200).json({ "data": result, "message": "sanjeet", "error_code": 200 });
//             // fetch the data...
//             function getGems(course_data, callback){
//                 console.log(course_data);
//                 if(course_data){
//                     var gems=0;
//                     UserScore.find({ "course": course_data._id,"user":req.query.user_id }).populate({
//                         path: 'chapter',select:'name gems _id'
//                     }).exec(function (err, data) {
//                         for(d in data){
//                             gems = gems +data[d].chapter.gems;
//                         }

//                         var obj = {}
//                         obj.name = course_data.name;
//                         obj.course_id = course_data._id;
//                         obj.desc = course_data.desc;                
//                         obj.total_chapter = course_data.chapters ? course_data.chapters.length:0;
//                         obj.is_active = true;
//                         obj.attempt_chapter = data.attempted_chapter;
//                         obj.gems = data.gems;  
//                         result.push(obj);     
                        
//                     }) 
                     
                                            

//             }else{
//                 console.log('data not available');
//                // callback();
//             } if(i==courses.length){
//                 res.status(200).json({ "data": result, "message": "success", "error_code": 200 });
//             } 

// callback();
//              }

//             if(courses && courses.length){
//                 console.log(courses);
//                 iterateGems(courses);
//             }
        }

    })
})

router.post('/fetch_courses_By_Id', function (req, res) {
    Course.find({ "language_id": req.body.language_id }).populate({
        path: 'language_id',
        select: 'name',
    }).exec(function (err, courses) {
        if (err) {
            res.status(500).json({ "error_code": 500, "message": err });
        } else {
            res.status(200).json({ "data": courses, "message": "success", "error_code": 200 });
        }
    })
})

// router.post('/delete-course', function (req, res) {
//     Course.findByIdAndRemove(req.body.course_id, function (err, course) {
//         if (!err) {
//             Language.update({ "_id": course.language_id },
//                 { $pull: { courses: req.body.course_id } },
//                 function (err, numberAffected) {
//                     if (err) {
//                         res.status(500).json({ "error_code": 500, "message": err });
//                     } else {
//                         res.status(200).json({ "data": course, "message": "success", "error_code": 200 });
//                     }
//                 });
//         } else {
//             res.status(500).json({ "error_code": 500, "message": err });
//         }
//     })
//})

router.post('/delete-course', function (req, res) {
    if(req.body.course_id){
        Course.find({"_id":req.body.course_id},function(err,data){
            if(err){
                res.status(200).json(err)
            }else{
                if(data[0].chapters.length == 0){
                    Course.remove({ "_id": req.body.course_id }, function (err, data) {
                        if (err) {
                            res.status(500).json({ "error_code": "500", "message": err });
                        } else {
                            res.status(200).json({"message": "courses has been deleted." }) }
                        }) 
                }else{
                    return res.status(500).json({ "data": data, "message": "Cant delete, chapters exists under this course.", "error_code": "500" });
                }
            }
        })
    }
})

router.post('/fetch-course-map', function (req, res) {
    if (req.body.user_id && req.body.course_id) {
        var Finalchapters = [];
        Course.findOne({"_id":req.body.course_id}).populate({
            path: 'chapters',
            select: 'name image desc buckets image questions',
            options: { sort: {timestamp: 'asc'} }
        }).exec(function (err, course) {
            if(course){
                var temp=0;
                var j =0;
                var i = 0;
                var state = true;
                var iterateChapter = function(arr) {
                     customAlert(arr[i],function(){
                         i++;
                         if(i < arr.length) {
                            iterateChapter(arr);   
                         }
                     }); 
                 }
                 function customAlert(chapter,callback){
                    if(chapter){
                       console.log(chapter ,'available');
                    UserScore.findOne({ "user": req.body.user_id, "chapter": chapter._id }).populate({
                        path: 'chapter',
                        select: 'name image questions buckets desc',
                    }).exec(function (err, doc) {
                       // console.log(chapter)
                        if(err){
                           // console.log("Error" + err);                                
                        }
                        if(doc){
                            //console.log(,'---');
                            var sbj = {
                                type: "scored",
                                chapter_id: doc.chapter._id,
                                chapter_name: doc.chapter.name,
                                score: doc.score ? doc.score+"/"+doc.chapter.questions.length : '',
                                desc: chapter.desc,
                                buckets: doc.chapter.buckets?  doc.chapter.buckets : '',
                                image: doc.chapter.image?  doc.chapter.image : '',
                                status: 'active'
                            }
                            Finalchapters.push(sbj);
                            callback()
                            
                        } else { 
                             
                            var nbj = {
                                type: "not scored",
                                chapter_id: chapter._id ? chapter._id:'',
                                chapter_name: chapter.name ? chapter.name :'',
                                score : 0+"/"+chapter.questions.length,
                                desc :chapter.desc,
                                buckets: chapter.buckets ?  chapter.buckets : '',
                                image: chapter.image ?  chapter.image : '',
                                status : state==true ? 'active' : 'inactive'
                            }
                            
                            state = false;                                
                            Finalchapters.push(nbj);
                            callback();
                        }
                        j++;                            
                        // console.log(chapter,'pkpk',i);
                        // console.log(i,'iterate',course.chapters.length);
                            
                        if(i==course.chapters.length){
        
                            var finalrespo = {
                                data: { user_id: req.body.user_id,chapters: Finalchapters },
                                message: "success",
                                error_code: 200,
                            }
                            res.status(200).json(finalrespo);                                
                                
                            }
                                
                    })
                }else{
                    //console.log('chapter not available');
                    callback()
                }

                 }

                if(course.chapters && course.chapters.length>0){
                   // console.log('course');
                    iterateChapter(course.chapters);
                } 
                else{
                   // console.log('course not ');
                    res.status(200).json({ "error_code": 704, "message": "No Chapter Found" });
                }




                // async.each(course.chapters,function(chapter,callback){
                //     UserScore.findOne({ "user": req.body.user_id, "chapter": chapter._id }).populate({
                //             path: 'chapter',
                //             select: 'name image',
                //         }).exec(function (err, doc) {
                //             if(err){
                //                 console.log("Error" + err);                                
                //             }
                //             if(doc){
                //                 var sbj = {
                //                     type: "scored",
                //                     chapter_id: doc.chapter._id,
                //                     chapter_name: doc.chapter.name,
                //                     score: doc.score ? doc.score : '',
                //                     desc: chapter.desc,
                //                     bucket: chapter.bucket?  chapter.bucket : '',
                //                     image: chapter.image?  chapter.image : '',
                //                     status: 'active'
                //                 }
                //                 Finalchapters.push(sbj);
                                
                //             } else { 
                                 
                //                 var nbj = {
                //                     type: "not scored",
                //                     chapter_id: chapter._id ? chapter._id:'',
                //                     chapter_name: chapter.name ? chapter.name :'',
                //                     score : 0,
                //                     desc :chapter.desc,
                //                     bucket: chapter.bucket ?  chapter.bucket : '',
                //                     image: chapter.image ?  chapter.image : '',
                //                     status : state==true ? 'active' : 'inactive'
                //                 }
                //                 state = false;                                
                //                 Finalchapters.push(nbj);
                //             }
                //             j++;                            
                //             if(j==course.chapters.length){
                //                 callback(Finalchapters);                                    
                //             }                        
                            
                //         })
                //         temp++;
                // },function(tot_data){
                //     var respo = {
                //         user_id: req.body.user_id,
                //         chapters: tot_data
                //     }
        
                //     var finalrespo = {
                //         data: respo,
                //         message: "success",
                //         error_code: 200,
                //     }
                //     res.status(200).json(finalrespo);                                
                // })

                // course.chapters.forEach(function (chapter,i) {
                //     UserScore.findOne({ "user": req.body.user_id, "chapter": chapter }).populate({
                //         path: 'chapter',
                //         select: 'name image',
                //     }).exec(function (err, doc) {
                //         if (err) {
                //             console.log("Error" + err);
                //         } else {
                //             if (doc) {
                //                 var sbj = {
                //                     type: "scored",
                //                     chapter_id: doc.chapter._id,
                //                     chapter_name: doc.chapter.name,
                //                     score: doc.score ? doc.score : '',
                //                     desc: chapter.desc,
                //                     bucket: chapter.bucket?  chapter.bucket : '',
                //                     image: chapter.image?  chapter.image : '',
                //                     status: temp==0 ?  'active' : 'inactive'
                //                 }
                //                 Finalchapters.push(sbj);
                //             } else { 
                //                 var nbj = {
                //                     type: "not scored",
                //                     chapter_id: chapter._id ?chapter._id:'',
                //                     chapter_name: chapter.name ? chapter.name :'',
                //                     score : 0,
                //                     desc :chapter.desc,
                //                     bucket: chapter.bucket?  chapter.bucket : '',
                //                     image: chapter.image?  chapter.image : '',
                //                     status: temp==0 ?  'active' : 'inactive'
                //                 }
                //                 Finalchapters.push(nbj);
                //                 temp++;                                
                //             }
                //             if (Finalchapters.length === course.chapters.length) {
                //                 var respo = {
                //                     user_id: req.body.user_id,
                //                     course_id: req.body.course_id,
                //                     chapters: Finalchapters,
                //                 }
                //                 var finalrespo = {
                //                     data: respo,
                //                     message: "success",
                //                     error_code: 200,
                //                 }
                //                 res.status(200).json(finalrespo);
                //             }
                //         }
                //     })
                // })
            }else{
                res.status(200).json({ "error_code": 704, "message": "No Chapter Found" });
            }
        })
    } else {
        res.status(200).json({ "error_code": 707, "message": "Incomplete params" });
    }
})


router.post('/edit-course', function (req, res) {
    if (req.body.course_id) {
        Course.findOne({ "_id": req.body.course_id }, function (err, courseObj) {
            if (err) {
                res.status(500).json({ "error_code": "500","message":"course id not found", "error": err });
            } else {
                if (courseObj) {
                    courseObj.name = req.body.name || courseObj.name;
                    courseObj.desc = req.body.desc || courseObj.desc;
                   // courseObj.image = req.body.image || courseObj.image;
                    if (req.files && req.files['avatar']) {
                        courseObj.image = typeof req.files != 'undefined' && typeof req.files['avatar'] != 'undefined' && req.files['avatar'].length ? req.files['avatar'][0].filename : '';
                    } else {
                        courseObj.image = courseObj.image;
                    }
                    courseObj.save(function (err, course) {
                        if (err) {
                            res.status(500).json({ "error_code": "500", "message": err });
                        } else {
                            res.status(201).json({ "data": course, "message": "success", "error_code": 200 });
                        }
                    })
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
    }

})

router.post('/get-course-by-id', function (req, res) {
    if(req.body.courses_id){
        console.log(res)
        Course.findById({ "_id": req.body.courses_id }, function (err, courses) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
           let obj = {
                id:courses.id,
                name:courses.name,
                image:courses.image,
                desc:courses.desc,
                language_id:courses.language_id,
                timestamp:courses.timestamp,
                is_active:courses.is_active,
                __v:courses.__v,
                course_type:courses.course_type
            };
            res.status(200).json({ "data": obj, "message": "success", "error_code": "200" });
        }
    })
}
else{
    res.status(500).json({"message": "Incomplete params", "error_code": "500" });
}
})

// method to get the attempted chapter count for a user...
// function getAttemptedChapter(user_id,course_id,cb){
//     var gems=0;
//     UserScore.find({ "course": course_id,"user":user_id }).populate({
//         path: 'chapter',select:'name gems _id'
//     }).exec(function (err, data) {
//         for(d in data){
//             gems = gems +data[d].chapter.gems;
//         }
//         if (err) {
//             cb(err, null);
//         } else {
//             cb(null, {"attempted_chapter":data.length,"gems":gems});
//         }
//     })    
// }
module.exports = router;