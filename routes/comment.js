// eslint-disable-next-line import/newline-after-import
const express = require('express');
const router = express.Router();
const Comment = require('../models/comment');
const Counter = require('../models/counter');

router.post('/', async (req, res) => {
  try {
    const comment = new Comment(req.body);
    comment.commentId = await Counter.getNext('commentId');
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const comments = await Comment.find({}, '-_id -__v').sort({ commentId: 1 });
    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
