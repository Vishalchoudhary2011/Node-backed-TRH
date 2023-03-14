const router = require('express').Router();
const controllers = require('../controllers/commentController');
router.get('/getOne/:id',controllers.getOneComment);
router.get('/getAll',controllers.getAllComment);
router.get('/getblogcomment/:id',controllers.getBlogAllComments);
router.post('/create', controllers.createComment);
router.delete('/delete/:id',controllers.deleteComment);
router.patch('/update/:id', controllers.updateComment);

module.exports = router;
