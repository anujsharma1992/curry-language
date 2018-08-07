const express = require('express'),
    router = express.Router(),
    secretkey = require('../config/config')["secretkey"];
    multer = require('multer');
    path = require('path');
    crypto = require('crypto');
    mime = require('mime');

const fileExtension = require('file-extension');

const appRoutes = {
    publicRoutes: ["/users/login","/users/sign-up","/users/get-user-gems","users/cheer-friend", "/users/verify-otp", "/users/fetch-all-users","/users/activate-deactivate",
        "/users/resetpassword-otpreq", "/users/reset-password-phone", "/users/save-device-token",
        "/users/social-signup", "/users/social-login", "/users/opt-language", "/users/fetch-user-languages",
        "/users/fetch-languages-user", "/languages/add-language", "/languages/update-language", "/languages/delete-language", "/languages/fetch-languages", "/languages/fetch-course-by-language", "/languages/fetch-demo-course", "/reasons/add-reason",
        "/reasons/fetch-reasons", "/fluencies/add-fluency", "/fluencies/fetch-fluencies", "/courses/add-course", "/courses/fetch-courses", "/courses/fetch_courses_By_Id", "/courses/delete-course","/courses/get-course-by-id",
        "/chapters/fetch-chapter-by-id","/chapters/fetch-unlock-bucket","/languages/fetch-demo","/chapters/delete-chapter",
        "/chapters/add-chapter", "/chapters/fetch-chapters","/chapters/fetch-chapter-questions", "/chapters/fetch-chapters", "/chapters/fetch-chapters-by-course", "/chapters/add-vocab-words", "/chapters/fetch-vocab-words","/chapters/get-chapter-by-id","/chapters/delete-chapter-empty",
        "/questiontype/add-questiontype", "/questiontype/fetch-questiontypes","/questions/add-chapter-question","/questions/delete-chapter-question","/questions/delete-question","/languages/get-language-by-id","/questions/fetch-questions-by-id",
        "/answers/add-answer", "/answers/fetch-answers", "/answers/update-answer", "/userscore/save-user-score", "/courses/fetch-course-map","/courses/get-course-list","/languages/edit-language","/courses/edit-course","/chapters/edit-chapter",
        "/courses/get-course-by-id","/bucketcategories/add-bucket-category","/bucketcategory/fetch-vocab-cat","/bucketcategory/add-bucket-category",,"/bucketcategory/edit-vocab-cat","/bucketcategory/fetch-vocab-cat-by-id","/bucketcategory/delete-vocab-cat",
        "/vocabbucket/add-bucket","/vocabbucket/fetch-vocab-bucket","/vocabbucket/fetch-vocab-cat-by-id","/vocabbucket/fetch-vocab-bucket-cat-by-id","/vocabbucket/edit-vocabbucket","/vocabbucket/delete-vocab"
        ,"/try/add-try"],
    userRoutes: ["/users/complete-profile", "/users/change-password", "users/user-view-profile", "users/user-edit-profile", "users/user-update-basic",
    , "users/match-users", "users/add-friend", "users/fetch-all-friends"]
}
// "/questions/add-questions", "/questions/update-question", "/questions/fetch-questions", "/questions/fetch-questions-by-chapter", "/questions/add-question-answer",
const BASE_PATH = path.resolve();

var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, BASE_PATH + '/public/files');
    },
    filename: function (req, file, callback) {
        // crypto.pseudoRandomBytes(16, function (err, raw) {
        //     var ext = String(file.mimetype).indexOf('jpg') === -1 ? mime.getExtension(file.mimetype) : 'jpg';
        //     callback(null, raw.toString('hex') + Date.now() + '.' + ext);
        // });
        crypto.pseudoRandomBytes(16, function (err, raw) {
            console.log(mime.getExtension(file.mimetype),'poiuytrfdcvbnm');
            callback(null, raw.toString('hex') + Date.now() + '.' + fileExtension(file.mimetype));
            //cb(null, raw.toString('hex') + Date.now());
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
}).fields([{ name: 'question_image', maxCount: 1 }, { name: 'question_audio', maxCount: 1 },
{ name: 'option_image', maxCount: 5 },
// { name: 'option_image[1]', maxCount: 1 },
// { name: 'option_image[2]', maxCount: 1 },
// { name: 'option_image[3]', maxCount: 1 },
// { name: 'option_image[4]', maxCount: 1 },
// { name: 'option_image[5]', maxCount: 1 },
{ name: 'option_audio', maxCount: 5 },
// { name: 'option_audio[1]', maxCount: 1 },
// { name: 'option_audio[2]', maxCount: 1 },
// { name: 'option_audio[3]', maxCount: 1 },
// { name: 'option_audio[4]', maxCount: 1 },
// { name: 'option_audio[5]', maxCount: 1 },
{ name: 'gallery', maxCount: 8 }]);

var chapterFile = multer({
    storage: storage
}).fields([{ name: 'avatar', maxCount: 1 },{ name: 'bucket_image', maxCount: 1 }, { name: 'audio', maxCount: 1 }]);

// Vocab bucket category image upload...
var imageFile = multer({
    storage: storage
}).fields([{ name: 'image', maxCount: 1 }]);

// Function to upload project images
// var questionImg = multer({ storage: storage }).any('uploadedImages');
router.use(function (req, res, next) {


    if (appRoutes.publicRoutes.indexOf(req.url) >= 0) {
        next();
    } else {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, secretkey, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, error_code: 406, message: 'Failed to authenticate token.' });
                } else {
                    req.decoded = decoded;
                    next();
                }
            });
        } else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.',
                error_code: 406
            });
        }
    }
})

router.use("/users", upload, require('../controller/user'));
router.use("/languages", upload, require('../controller/language'));
router.use("/fluencies", require('../controller/fluency'));
router.use("/reasons", require('../controller/reason'));
router.use("/courses", upload, require('../controller/course'));
router.use("/chapters", chapterFile, require('../controller/chapter'));
router.use("/questiontype", require('../controller/questiontype'));
router.use("/questions", questionFile, require('../controller/question'));
router.use("/answers", answerFile, require('../controller/answer'));
router.use("/vocabbucket", imageFile, require('../controller/vocabbucket'));
router.use("/userscore", questionFile, require('../controller/userScore'));
router.use("/bucketcategory",imageFile, require('../controller/bucketcategory'));
router.use("/try", imageFile, require('../controller/try'));

module.exports = router;


