const Content = require('../models/contentModel');
var imagepath;

const getAllContent = (req, res)=>{
    Content.find().then(result =>{
        if(result){
            if(result.length===0){
                res.status(200).json({
                    status : 'No New Contents Here! please create new Content',
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
                status : 'Contents Not Found'
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            status : 'Error in findingAllContents',
            message : err
        });
    })
}

const getOneContent = (req,res)=>{
    console.log(req.params.id);
    Content.findOne({_id : req.params.id}).then(result =>{
        if(result){
            res.status(200).json({
                status : 'Found',
                message : result
            });
        }
        else{
            res.status(404).json({
                status : 'Content Not Found'
            });
        }
    })
    .catch(err=>{
        res.status(500).json({
            status : 'Error in findingOneContent',
            message : err
        });
    })
}

const createContent = async (req,res)=>{
    
    if(req.file == undefined){
        imagepath = "";
    }else{
        imagepath = `${req.file.location}`;
    }

      let content = await new Content({
        title : req.body.content_title,
        description : req.body.content_descrption,
        contentImages : imagepath
        });

     content.save().then(result =>{
        res.status(201).json({
            status : 'Created',
            message : result
        })
    })
    .catch(err =>{
        res.status(500).json({
            status : '500',
            message : `Error in Creating Content ${err}`
        })
    })
}

const updateContent = (req,res)=>{
    if(req.file == undefined){
        imagepath = "";
    }else{
        imagepath = `${req.file.location}`;
    }
    Content.updateOne(
        {_id:req.params.id},
        {
            $set:{
                title : req.body.content_title,
                description : req.body.content_descrption,
                contentImages : imagepath,
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
                status : 'Error in Updating Content',
                message : err
            })
        })
}

const deleteContent = (req,res)=>{
    Content.deleteOne({_id : req.params.id})
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

module.exports = {
    getAllContent : getAllContent,
    getOneContent : getOneContent,
    createContent : createContent,
    updateContent : updateContent,
    deleteContent : deleteContent,
}