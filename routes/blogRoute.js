// const multer = require('multer');
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         cb(null, './about');
//     },
//     filename: function (req, file, cb) {
//         cb(null,Date.now()+ file.originalname);
//     }
// });
// const uploadImg = multer({ storage: storage })

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
          cb(null, 'blogsImage/'+Date.now().toString()+'-'+file.originalname)
        }
      })
     }).single('image');


const router = require('express').Router();

const controllers = require('../controllers/BlogControllers');

router.get('/getOne/:id', controllers.getOneBlog);
router.get('/getAll',controllers.getAllBlog);
router.post('/create',uploadImg,controllers.createBlog);
router.delete('/delete/:id',controllers.deleteBlog);
router.patch('/update/:id',uploadImg,controllers.updateBlog);
// router.get('/categoriesCount',controllers.getCategoriesCount);
// router.get('/recentBlog',controllers.recentBlog);

module.exports = router;
