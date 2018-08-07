var express = require('express'),
    router = express.Router();

var Fluency = require('../models/fluency');

router.post('/add-fluency', function (req, res) {
    var fluency = new Fluency(req.body);
    fluency.save(function (err, data) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(201).json({ "data": data, "message": "success", "error_code": "200" });
        }
    })
})

router.get('/fetch-fluencies', function (req, res) {
    Fluency.find({ "is_active": true }, function (err, data) {
        if (err) {
            res.status(500).json({ "error_code": "500", "message": err });
        } else {
            res.status(200).json({ "data": data, "message": "success", "error_code": "200" });
        }
    })
})

module.exports = router;