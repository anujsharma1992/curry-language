var express = require('express'),
    router = express.Router();

var Bucketcategory = require('../models/bucketcategory');

router.post('/add-bucket-category', function (req, res) {
    var bucketcategoryObj = new Bucketcategory();
    bucketcategoryObj.title = req.body.title;
    if (req.files && req.files['image']) {
        bucketcategoryObj.image = typeof req.files != 'undefined' && typeof req.files['image'] != 'undefined' && req.files['image'].length ? req.files['image'][0].filename : '';
    } else {
        bucketcategoryObj.image = '';
    }   
    console.log(bucketcategoryObj,'inset obj');
    bucketcategoryObj.save(function (err, data) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(201).json({ "data": data, "message": "success", "error_code": "200" });
        }
    })
})

router.get('/fetch-vocab-cat', function (req, res) {
    Bucketcategory.find({},function (err, category) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": category, "message": "success", "error_code": "200" });
        }
    })
})

router.post('/fetch-vocab-cat-by-id', function (req, res) {
    Bucketcategory.find({ "_id": req.body.cat_id },function (err, category) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": category, "message": "success", "error_code": "200" });
        }
    })
})

router.post('/edit-vocab-cat', function (req, res) {

    if (req.body.cat_id) {
        Bucketcategory.findOne({ "_id": req.body.cat_id }, function (err, cat) {
            if (err) {
                res.status(500).json({ "error_code": "500", "message": "chapter id not exist.","error":err});
            } else {
                if (cat) {
                    cat.title = req.body.title || cat.title;
                    if (req.files && req.files['image']) {
                        cat.image = typeof req.files != 'undefined' && typeof req.files['image'] != 'undefined' && req.files['image'].length ? req.files['image'][0].filename : '';
                    }
                    cat.save(function (err, chapter) {
                        if (err) {
                            res.status(500).json({ "error_code": "500", "message": err });
                        } else {
                            res.status(201).json({ "data": chapter, "message": "success", "error_code": "200" });                            
                        }
                    })
                }
            }
        })
    } else {
        res.status(200).json({ "error_code": "707", "message": "Incomplete params", "data": req.body });
    }
    
})


router.post('/delete-vocab-cat', function (req, res) {
    console.log(req.body,'--------------------');
    if(req.body.cat_id){
        Bucketcategory.find({"_id":req.body.cat_id},function(err,data){
            if(err){
            res.status(200).json(err)
            }else{
                if(data && data.length>0){
                    Bucketcategory.remove({ "_id": req.body.cat_id }, function (err, data) {
                    if (err) {
                    res.status(500).json({ "error_code": "500", "message": err });
                    } else {
                    res.status(200).json({"error_code": "200","message": "category has been deleted." }) }
                    }) 
                }else{
                    return res.status(500).json({"message": "Cant delete, category not exists.", "error_code": "500" });
                }
            }
        })
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

module.exports = router;