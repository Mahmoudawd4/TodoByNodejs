const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  commentId: { type: Number, required: true, unique: true },
  text: { type: String, required: true },
});

module.exports = mongoose.model('Comment', CommentSchema);
