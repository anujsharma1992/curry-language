var express = require('express'),
    router = express.Router();

var Reason = require('../models/reason');

router.post('/add-reason', function (req, res) {
    var reason = new Reason(req.body);
    reason.save(function (err, data) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(201).json({ "data": data, "message": "success", "error_code": "200" });
        }
    })
})

router.get('/fetch-reasons', function (req, res) {
    Reason.find({ "is_active": true }, function (err, data) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": data, "message": "success", "error_code": "200" });
        }
    })
})

module.exports = router;