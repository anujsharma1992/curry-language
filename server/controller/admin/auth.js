var express = require('express'),
    md5     = require('md5'),    
    router = express.Router();

var Adminuser = require('../../models/adminuser');

router.post('/login', function (req, res) {
    console.log('body with testing');
    Adminuser.find({"email":req.body.email,"password":md5(req.body.password)},function (err, data) {
        if (err) {
            res.status(500).json({ "error_code": "400", "message": err });
        }
        if(data && data.length>0){
            res.status(201).json({ "data": data, "message": "success", "status": "200" });
        }
        else{
            res.status(201).json({"message": "Invalid email or password!!", "status": "404" });
        }
    })
})


router.post('/change-password', function (req, res) {
    if(!req.body.email || !req.body.password || !req.body.new_password){
        res.status(500).json({ "error_code": 400, "message": "Mendatory parameters missing!" });
    }
    Adminuser.find({"email":req.body.email,"password":md5(req.body.password)},function (err, data) {
        if (err) {
            res.status(500).json({ "error_code": "400", "message": err });
        }
        if(data && data.length>0){
            // code to update old password...
            Adminuser.update({ "email": req.body.email },
                { $set: { "password": md5(req.body.new_password) } },
                function (err, numberAffected) {
                    if (err) {
                        res.status(500).json({ "error_code": 500, "message": err });
                    }
                    console.log(numberAffected,'af');
                    res.status(200).json({ "message": "Password updated successfully.", "error_code": 200 });
                });
        }
        else{
            res.status(201).json({"message": "Please enter correct old password!!", "status": "404" });
        }
    })
})



module.exports = router;


// let getRecommended = (criteria, cb) => {
//     userDAO.getRecommendedData(criteria, (err, dbSubData) =>{
//         console.log(dbSubData);
//         for( dbD in dbSubData){
//             console.log(dbD);
//         }
//     if (err) {
//         cb(null, { "statusCode": util.statusCode.INTERNAL_SERVER_ERROR, "statusMessage": util.statusMessage.DB_ERROR })
//     }
//     if(dbSubData && dbSubData.length){
//         responseArr = [];
//         async.forEach(dbSubData, function(data, callback) {
//             //dbSubData.forEach(function(data) {
//             let criteria2 = {
//             userId:data.fromUserId
//             };
//             //get user business details
//             VALIDATE.getUserDesignation(criteria2, (err, response) => {
//                 console.log(response);
//                 if (data.profilePicture) {
//                 profilePicture = util.fileUrl('profile', data.profilePicture); 
//                 } else {
//                 profilePicture = ""; 
//                 }
//                 dataObj = {};
//                 dataObj["userId"] = data.fromUserId;
//                 dataObj["name"] = data.name;
//                 dataObj["org"] = (response) ? response.org : "";
//                 dataObj["designation"] = (response) ? response.designation : "";
//                 dataObj["profilePicture"] = profilePicture;
//                 responseArr.push(dataObj);
//                 callback();
//             });
//         }, function(err){
//         cb(null, responseArr);
//         });
//     }else{
//     cb(null, []); 
//     }
//     });
//    }