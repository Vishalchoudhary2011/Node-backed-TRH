var mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    fullname: { type: String },
    email: { type: String },
    comment: { type: String },
    blogID: { type: String },
    comment_status: { type: String },
  },
  { timestamps: true }
);

// defining a Customer model
module.exports = mongoose.model("Comment", CommentSchema);;
