const router = require('express').Router();
const controllers = require('../controllers/contactController');
router.get('/getOne/:id',controllers.findOne);
router.get('/getAll',controllers.findAll);
router.post('/create', controllers.create);
router.delete('/delete/:id',controllers.delete);
router.patch('/update/:id', controllers.update);

module.exports = router;
