const Comment = require('../models/commentModel')

const getAllComment = (req, res)=>{
    Comment.find().then(result =>{
        if(result){
            if(result.length===0){
                res.status(200).json({
                    status : 'No New Comments Here! please create new Comment',
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
                status : 'Comments Not Found'
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            status : 'Error in findingAllComments',
            message : err
        });
    })
}

const getOneComment = (req,res)=>{
    console.log(req.params.id);
    Comment.findOne({_id : req.params.id}).then(result =>{
        if(result){
            res.status(200).json({
                status : 'Found',
                message : result
            });
        }
        else{
            res.status(404).json({
                status : 'Comment Not Found'
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            status : 'Error in findingOneComment',
            message : err
        });
    })
}

const createComment = async (req,res)=>{   

      let comment = await new Comment({
        fullname: req.body.fullname,
        email: req.body.email,
        comment: req.body.comment,
        blogID: req.body.blog_id,
        comment_status: req.body.comment_status
        });

     comment.save().then(result =>{
        res.status(201).json({
            status : 'Created',
            message : result
        })
    })
    .catch(err =>{
        res.status(500).json({
            status : '500',
            message : `Error in Creating Comment ${err}`
        })
    })
}

const updateComment = (req,res)=>{
       Comment.updateOne(
        {_id:req.params.id},
        {
            $set:{
                fullname: req.body.fullname,
                email: req.body.email,
                comment: req.body.comment,
                blogID: req.body.blog_id,
                comment_status: req.body.comment_status
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
                    status : 'Not Updated'
                });
            }
        })
        .catch(err =>{
            res.status(500).json({
                status : 'Error in Updating Comment',
                message : err
            })
        })
}

const deleteComment = (req,res)=>{
    Comment.deleteOne({_id : req.params.id})
    .then(result =>{
        if(result.deletedCount){
            res.status(200).json({
                status : 'Success',
                message : result
            });
        }
        else{
            res.status(404).json({
                status : 'Failed Deletion'
            });
        }
    })
    .catch(err =>{
        res.status(500).json({
            status : 'Error in Deletion',
            message : err
        })
    })
}

const getBlogAllComments = (req,res)=>{
    console.log(req.params.id);
    Comment.find({blogID : req.params.id}).then(result =>{
        if(result){
            res.status(200).json({
                status : 'Found',
                message : result
            });
        }
        else{
            res.status(404).json({
                status : 'Comment Not Found'
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            status : 'Error in findingOneComment',
            message : err
        });
    })
}

module.exports = {
    getAllComment : getAllComment,
    getOneComment : getOneComment,
    createComment : createComment,
    updateComment : updateComment,
    deleteComment : deleteComment,
    getBlogAllComments : getBlogAllComments,
}