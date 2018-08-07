var express = require('express'),
    md5     = require('md5'),    
    router = express.Router();

var Adminuser = require('../../models/adminuser');

router.post('/add-language', function (req, res) {
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