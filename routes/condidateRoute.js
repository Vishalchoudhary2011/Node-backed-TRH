const multer = require('multer');
const { S3Client } = require('@aws-sdk/client-s3')
const multerS3 = require("multer-s3");
const {S3}  = require("aws-sdk");

const s3 = new S3Client();

const uploadImg = multer({
     storage: multerS3({
        s3: s3,
        bucket: process.env.AWS_BUCKET_NAME,
        metadata: function (req, file, cb) {
          cb(null, {fieldName: file.fieldname});
        },
        key: function (req, file, cb) {
          cb(null, 'upload/'+Date.now().toString()+'-'+file.originalname)
        }
      })
     }).single('resume');

const router = require('express').Router();
const controllers = require('../controllers/condidateController');
router.get('/getOne/:id',controllers.getOnecandidateReq);
router.get('/getAll',controllers.getAllcandidateReq);
router.post('/create',uploadImg, controllers.createcandidateReq);
router.delete('/delete/:id',controllers.deletecandidateReq);
router.patch('/update/:id',uploadImg, controllers.updatecandidateReq);

module.exports = router;
