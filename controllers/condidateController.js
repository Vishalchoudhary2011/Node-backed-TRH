const candidateReq = require('../models/candidateReqModel');
const multiparty = require("multiparty");
const nodemailer = require("nodemailer")
const smtpTransport = require("nodemailer-smtp-transport");
// var urls = process.env.HOST_URL;

const getAllcandidateReq = (req,res)=>{
    candidateReq.find()
    .then(result =>{
        if(result){
            if(result.length===0){
                res.status(200).json({
                    status : 'No New candidate Request Here! please create new candidate Request',
                });
            }
            else{
                res.status(200).json({
                    status : 'Found',
                    message : result
                });
            }            
        }
        else{
            res.status(404).json({
                status : 'candidate Request Not Found'
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            status : 'Error in findingAllcandidateReqs',
            message : err
        });
    })
}

const getOnecandidateReq = (req,res)=>{
    console.log(req.params.id);
    candidateReq.findOne({_id : req.params.id})
    .then(result =>{
        if(result){
            res.status(200).json({
                status : 'Found',
                message : result
            });
        }
        else{
            res.status(404).json({
                status : 'candidate Request Not Found'
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            status : 'Error in finding One candidate Request',
            message : err
        });
    })
}

const createcandidateReq = async (req,res)=>{ 
           
        var resumepath;  
        if(req.file == undefined){
            resumepath = "";
        }else{
           resumepath = `${req.file.location}`;
        }
    let candidate_Req = await new candidateReq({
        candidate_name: req.body.candidateName,
        email: req.body.email,
        phone_number: req.body.phone_number,
        applypostion: req.body.postion,
        resume: resumepath,
        technology: req.body.technology,
    });
    candidate_Req.save().then((docs) =>{
            var transporter = nodemailer.createTransport(smtpTransport({
            host: process.env.MAIL_HOST,
            secureConnection: false,
            tls: {
              rejectUnauthorized: false
            },
            port: process.env.MAIL_PORT,
            auth: {
                user: process.env.AUTH_USER_CAREER,
                pass: process.env.AUTH_PASS_CAREER,
          }
        }));
        var mailOptions = {
            from: docs.email,
            to: process.env.AUTH_USER_CAREER,
            subject: "Candidate Request for job apply",
            text:
              "Candidate Name:-" +
              docs.andidate_name +
              "\n Email:- " +
              docs.email +
              "\n Apply For postion:-" +
              docs. applypostion+
              "\n Phone No:-" +
              docs.phone_number +
              "\n resume :-" +
              docs.resume +
              "\n technology" +
              docs.technology,
          };
      
          transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error)
              res.status(400).json({message: "Email not sent"});
            } else {
              res.status(200).json({message: "Email sent successfully"});
            }
          }); 
    }).catch(err =>{
        console.log(err)
        res.status(500).json({
            status : "500",
            message : 'Error in Creating candidate Request'
        })
    })
    var nodemailer = require("nodemailer");
};

const updatecandidateReq = (req,res)=>{
    if(req.file == undefined){
        resumepath = "";
    }else{
        resumepath = `${req.file.location}`;
    }
    candidateReq.updateOne(
        {_id:req.params.id},
        {
            $set:{
                candidate_name: req.body.candidateName,
                email: req.body.email,
                phone_number: req.body.phone_number,
                applypostion: req.body.postion,
                resume: resumepath,
                technology: req.body.technology,
            }
        })
        .then(result =>{
            if(result.modifiedCount){
                res.status(200).json({
                    status : 'Updated',
                    message : result
                });
            }
            else{
                res.status(404).json({
                    status : 'Not Updated candidate Request'
                });
            }
        })
        .catch(err =>{
            res.status(500).json({
                status : 'Error in Updating candidate Request',
                message : err
            })
        })
}

const deletecandidateReq = (req,res)=>{
    candidateReq.deleteOne({_id : req.params.id})
    .then(result =>{
        if(result.deletedCount){
            res.status(200).json({
                status : 'Success',
                message : result
            });
        }
        else{
            res.status(404).json({
                status : 'candidate Request may be Deleted OR Not Exist'
            });
        }
    })
    .catch(err =>{
        res.status(500).json({
            status : 'Error in Deletion candidate Request',
            message : err
        })
    })
}

module.exports = {
    getAllcandidateReq : getAllcandidateReq,
    getOnecandidateReq : getOnecandidateReq,
    createcandidateReq : createcandidateReq,
    updatecandidateReq : updatecandidateReq,
    deletecandidateReq : deletecandidateReq,
}