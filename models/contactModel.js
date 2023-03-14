var mongoose = require("mongoose");

const ContactUsSchema = new mongoose.Schema(
  {
    email: { type: String },
    message: { type: String },
    name: { type: String },
    phone: { type: Number },
    website: { type: String },
  },
  { timestamps: true }
);

// defining a Customer model
module.exports = mongoose.model("ContactUs", ContactUsSchema);;
