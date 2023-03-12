const mongoose = require('mongoose');

const todoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 20,
  },
  status: {
    type: String,
    enum: ['to-do', 'in progress', 'done'],
    default: 'to-do',
  },
  tags: [{
    type: String,
    maxlength: 10,
  }],
}, {
  timestamps: true,
});

const Todo = mongoose.model('Todo', todoSchema);
// eslint-disable-next-line eol-last
module.exports = Todo;