const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
candidate_name : { type : String },
email: { type: String },
phone_number: { type: String },
applypostion: { type: String },
resume: { type: String },
technology: {type: String}
},{ timestamps: true })

module.exports = mongoose.model("candidate", candidateSchema )