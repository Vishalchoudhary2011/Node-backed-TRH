// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './content');
//     },
//     filename: function (req, file, cb) {             
//         cb(null, new Date().toISOString().replace(/[.:]/g, '-')+ file.originalname.replace(/ /g,'_'));
//     }
// });

const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require("multer-s3");
const {S3}  = require("aws-sdk");

const s3 = new S3Client();

const uploadImg = multer({
     storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        // acl: 'PublicRead',
        metadata: function (req, file, cb) {
          cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
          cb(null, 'contentImage/'+Date.now().toString()+'-'+file.originalname)
        }
      })
     }).single('content_Image');

// const uploadImg = multer({ storage: storage }).single('content_Image');

const router = require('express').Router();
const controllers = require('../controllers/contentControllers');
router.get('/getOne/:id',controllers.getOneContent);
router.get('/getAll',controllers.getAllContent);
router.post('/create',uploadImg, controllers.createContent);
router.delete('/delete/:id',controllers.deleteContent);
router.patch('/update/:id',uploadImg, controllers.updateContent);

module.exports = router;
