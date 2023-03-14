const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
    title : {
        type : String
    },
    description : [
        {
            type : String
        }
    ],
    contentImages :{
            type : String
        }
}, { timestamps: true })

module.exports = mongoose.model('content',contentSchema);

