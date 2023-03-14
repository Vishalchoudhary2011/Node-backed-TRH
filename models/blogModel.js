const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
    bannerImage : {
        type : String,
    },
    author : {
        type: String
    },
    date : {
        type : String
    },
    title: {
        type : String,
        required : true
    },
    mainDesc : {
        type : String,
        required : true
    },
    content : [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref:'content'

    }],
    categories :
        {
            type: String
        },
    quotes : [
        {
            type : String,
        },
    ],
    metaDesc : [
        {
            type: String
        }
    ],
    keywords : [
        {
            type :String
        }
    ],
}, { timestamps: true })

module.exports = mongoose.model('blogData',blogSchema);

