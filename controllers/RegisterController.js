const Register = require('../models/registerModel');
const bcrypt = require('bcrypt');
const jwt = require('');
const jwtKey = 'e-com';
const emailValidator = require("email-validator");
const nodeMailer = require('nodemailer');
const smtpTransport = require("nodemailer-smtp-transport");

const createRegister = async (req,res)=>{ 
    var checkEmail = await Register.findOne({email:req.body.email});
    if(checkEmail!=null){
        res.send({message:'Email is already Exist'});
    }
    else{

     if(!emailValidator.validate(req.body.email)){
        res.send({message:'Invalid Email'});
    }
    if(req.body.password !== req.body.confirm_password){
        res.send({message:'Password And Confirm Password Is Not Matched'});
    }
    
    var salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(req.body.password, salt);
    
    let register = new Register({
        name : req.body.name,
        email : req.body.email,
        email_status:'0',
        password : hashedPassword,
        mobile : req.body.mobile,
        occupation : req.body.occupation,
        address : req.body.address,
    });

    await register.save().then(result =>{    
        let transporter = nodeMailer.createTransport(smtpTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT,
            secureConnection: false,
            tls: {
                rejectUnauthorized: false
            },
            auth: {
              user: process.env.AUTH_USER_INFO,
              pass: process.env.AUTH_PASS_INFO, 
            },
        }));

        // var link = process.env.HOST_URL+'user/emailstatus/'+result._id;
        var link = process.env.FORNT_HOST_URL+'user/emailstatus/'+result._id;
        var mailOptions = {
            from: process.env.AUTH_USER_INFO, // sender address
            to: result.email, // list of receivers
            subject: "Verify Your Email", // Subject line
            html: "<p>Click the Button to verify Your Email.</p><a href="+link+" class='btn btn-primary'>Click Me</a>",
        };

        var mailOptions2 = {
            from: process.env.AUTH_USER_INFO, // sender address
            to: process.env.AUTH_USER_INFO, // list of receivers
            subject: "New User Register", // Subject line
            text: "<p>User Details.</p> Name:-" +
            result.name +
            "\n Email:- " +
            result.email +
            "\n Occupation:-" +
            result.occupation +
            "\n Phone No:-" +
            result.mobile +
            "\n Address" +
            result.address,
        };
    
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        transporter.sendMail(mailOptions2, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });

        res.status(201).send({
            status : true,
            message: 'User Register Successfully..Please Verify Your Email',
            data : result
        })
    })
    .catch(err =>{
        res.status(500).send({
            status : false,
            message : 'Error in User Registration'
        })
    })
    }   
}

const login = (req,res)=>{

    if(!emailValidator.validate(req.body.email)){
        res.status(403).send({message:'Invalid Email'});
    }

    Register.findOne({email : req.body.email})
    .then( async (result) =>{
              if(result){
            var pwd = bcrypt.compareSync(req.body.password, result.password);
            if(!pwd){
                res.status(400).send({message:'Invalid Credential'});
            }else{
               
                if(result.email_status!==1){
                    res.status(400).send({message: "Please Verify Your Email.."});      
                }
                let twk = await jwt.sign({_id:result.id, iat: Math.floor(Date.now() / 1000) - 30 },jwtKey);
                res.status(200).send({
                    status : true,
                    message: 'Login Successfully..',
                    Data : result,
                    token : twk
                });
            }
        }
        else{
            res.status(403).send({
                status: false,
                message : 'Incorrect Details Please Try Again or Please Sing up'
            });
        }
    })
    .catch(err =>{    
          res.status(500).send({message : "Error In Login..."});
    })
}

const forgetPassword = async (req,res)=>{

    if(!emailValidator.validate(req.body.email)){
        res.status(400).send({message:'Invalid Email'});
    }

    await Register.findOne({email : req.body.email})
    .then( (result) =>{
        if(result){
            let transporter = nodeMailer.createTransport(smtpTransport({
                host: process.env.MAIL_HOST,
                port: process.env.MAIL_PORT,
                secureConnection: false,
                tls: {
                    rejectUnauthorized: false
                },
                auth: {
                  user: process.env.AUTH_USER_INFO,
                  pass: process.env.AUTH_PASS_INFO, 
                },
            }));
    
            // var link = process.env.HOST_URL+'user/forget-pwd/'+result._id;
            var link = process.env.FORNT_HOST_URL+'forgotpassword/'+result._id;
            var mailOptions = {
                from: process.env.AUTH_USER_INFO, // sender address
                to: result.email, // list of receivers
                subject: "Forget Password", // Subject line
                html: "<p>Click the Button to reset your password</p><a href="+link+" class='btn btn-primary'>Click Me</a>",
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                  console.log(error);
                } else {
                  console.log('Email sent: ' + info.response);
                }
            });
           
            //final Response
            res.status(200).send({
                status : true,
                message : 'Send the Link to Email. Please Reset your Password.'
            });
        }
        else{
            res.status(409).send({
                status : false,
                message : 'Email not Found please SingUp'
            });
        }
    })
    .catch(err=>{
        res.status(500).send({
            status : false,
            message : 'Error in Forget Password'
        });
    })
}

const resetPassword = async (req,res)=>{
        console.log(res.body);
    if(req.body.password !== req.body.confirm_password){

        res.send({message:'Password And Confirm Password Is Not Matched'});
    }

        var salt = await bcrypt.genSalt(10);
    var hashedPassword = await bcrypt.hash(req.body.password, salt);

    await Register.updateOne(
        {_id:req.params.id},
        {
            $set:{
                password : hashedPassword,
            }
        })
    .then(result =>{
        if(result.modifiedCount){
            res.status(200).send({
                status : true,
                message: 'Password Updated Successfully..',
                data : result
            });
        }
        else{
            res.status(404).send({
                Status: false,
                message : 'Password Not Updated..'
            });
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).send({
            status : false,
            message : 'Error in Reset Password'
        })
    })
}

const getUserDetails = (req,res)=>{
    Register.findOne({_id : req.params.id})
    .then(result =>{
        if(result){
            res.status(200).send({
                status : 'Data Found Successfully',
                message : result
            });
        }
        else{
            res.status(404).send({
                status : false,
                message: 'Data Not Found'
            });
        }
    })
    .catch(err=>{
        res.status(500).send({
            status : false,
            message: 'Profile Data Not Found'
        });
    })
}

const emailStatus = (req,res)=>{
    
    Register.updateOne(
        {_id:req.params.id},
        {
            $set:{
                email_status : '1',
            }
        })
        .then(result =>{
            if(result.modifiedCount){
              
                res.redirect(process.env.FORNT_HOST_URL+'verifiey/'+req.params.id);
            }
            else{
                res.status(404).send({
                    Status: false,
                    message : 'Email Not Verified..'
                });
            }
        })
        .catch(err =>{
            console.log(err);
            res.status(500).send({
                status : false,
                message : 'Error in Updating Email Status'
            })
        })
}

const editProfile = (req,res)=>{
    Register.findOne({_id : req.params.id})
    .then( async (result) =>{
        if(result){
            res.status(200).send({
                status : true,
                message: 'Data Found Successfully..',
                Data : result,
            });
        }
        else{
            res.status(400).send({
                status: false,
                message : 'No Result Found.'
            });
        }
    })
    .catch(err=>{
        res.status(400).send({
            status : false,
            message : 'No Data Found.'
        });
    })
}

const updateProfile = (req,res)=>{
    Register.updateOne(
        {_id:req.params.id},
        {
            $set:{
                name : req.body.name,
                mobile : req.body.mobile,
                occupation : req.body.occupation,
                address : req.body.address
            }
        })
        .then(result =>{
            if(result.modifiedCount){
                res.status(200).send({
                    status : 'Data Updated Successfully..',
                    message : result
                });
            }
            else{
                res.status(404).send({
                    Status: false,
                    message : 'Data Not Updated.'
                });
            }
        })
        .catch(err =>{
            res.status(500).send({
                status : false,
                message : 'Error in Updating Data...'
            })
        })
}

module.exports = {
    createRegister : createRegister,
    login : login,
    getUserDetails: getUserDetails,
    emailStatus:emailStatus,
    forgetPassword: forgetPassword,
    resetPassword: resetPassword,
    editProfile: editProfile,
    updateProfile: updateProfile,
}