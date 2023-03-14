const mongoose = require('mongoose');

const registerSchema = new mongoose.Schema({
    name : {
        type : String,
    },
    email : {
        type : String,
    },
    password : {
        type : String,
    },
    mobile : {
        type : Number,
    },
    email_status : {
        type : Number,
    },
    occupation : {
        type : String,
    },
    address : {
        type : String,
    },
}, { timestamps: true })

module.exports = mongoose.model('register',registerSchema);

