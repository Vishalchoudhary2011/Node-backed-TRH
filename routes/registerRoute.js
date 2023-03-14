const router = require('express').Router();
const jwt = require('jsonwebtoken');
const jwtKey = 'e-com';

const controllers = require('../controllers/RegisterController');

const checkJwt = async (req, res, next) => {
    var reqToken = req.headers['authorization'];
    if(typeof reqToken!=='undefined'){
        const bearer = reqToken.split(' ');
        const bearerToken = bearer[1];
        const tokenVar = await jwt.verify(bearerToken, jwtKey, (err, decode) => {
            if(err){
                res.status(404).send({Message:'Authorization is Invalid'});
            }else{
                next();
            }
        });
    }else{
        res.status(403).send({Message:'Authorization is Failed'});
    }   
};

router.post('/create',controllers.createRegister);
router.post('/login',controllers.login);
router.get('/profile/:id',checkJwt,controllers.getUserDetails);
router.get('/editprofile/:id',checkJwt,controllers.editProfile);
router.post('/updateprofile/:id',checkJwt,controllers.updateProfile);
router.get('/emailstatus/:id',controllers.emailStatus);
router.post('/forget',controllers.forgetPassword);
router.post('/reset-pwd/:id',controllers.resetPassword);

module.exports = router;
