const express = require('express'),
    router = express.Router(),
    secretkey = require('../config/config')["secretkey"];
multer = require('multer');
path = require('path');
crypto = require('crypto');
mime = require('mime');

const appRoutes = {
    publicRoutes: ["/admin/login","admin/change-password","/languages/add-language"]
}
// 
const BASE_PATH = path.resolve();
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, BASE_PATH + '/public/files');
    },
    filename: function (req, file, callback) {
        crypto.pseudoRandomBytes(16, function (err, raw) {
            var ext = String(file.mimetype).indexOf('jpg') === -1 ? mime.getExtension(file.mimetype) : 'jpg';
            callback(null, raw.toString('hex') + Date.now() + '.' + ext);
        });
    }
});

var upload = multer({
    storage: storage
}).fields([{ name: 'avatar', maxCount: 1 }, { name: 'bg_image', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]);

var answerFile = multer({
    storage: storage
}).fields([{ name: 'ansImage', maxCount: 1 }, { name: 'ansAudio', maxCount: 1 }, { name: 'gallery', maxCount: 8 }]);

var questionFile = multer({
    storage: storage
}).fields([{ name: 'QuestionImage', maxCount: 1 }, { name: 'QuestionAudio', maxCount: 1 },
{ name: 'option_image[0]', maxCount: 1 },
{ name: 'option_image[1]', maxCount: 1 },
{ name: 'option_image[2]', maxCount: 1 },
{ name: 'option_image[3]', maxCount: 1 },
{ name: 'option_image[4]', maxCount: 1 },
{ name: 'option_image[5]', maxCount: 1 },
{ name: 'gallery', maxCount: 8 }]);

var chapterFile = multer({
    storage: storage
}).fields([{ name: 'img', maxCount: 1 }, { name: 'audio', maxCount: 1 }]);
// Function to upload project images
// var questionImg = multer({ storage: storage }).any('uploadedImages');
// router.use(function (req, res, next) {
//     if (appRoutes.publicRoutes.indexOf(req.url) >= 0) {
//         next();
//     } else {
//         var token = req.body.token || req.query.token || req.headers['x-access-token'];
//         if (token) {
//             jwt.verify(token, secretkey, function (err, decoded) {
//                 if (err) {
//                     return res.json({ success: false, error_code: 406, message: 'Failed to authenticate token.' });
//                 } else {
//                     req.decoded = decoded;
//                     next();
//                 }
//             });
//         } else {
//             return res.status(403).send({
//                 success: false,
//                 message: 'No token provided.',
//                 error_code: 406
//             });
//         }
//     }
// })

// router.use("/admin", answerFile, require('../controller/admin/auth'));
// router.use("/language", answerFile, require('../controller/admin/language'));

module.exports = router;


