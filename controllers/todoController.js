// const { validationResult } = require('express-validator');
// const asyncWrapper = require('../lib/helperFunction');
const Todo = require('../models/todo');

const createTodo = (data) => Todo.create(data);

// const getTodoById = (data) => Todo.findById(data).populate('userId');

const getTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    const todoById = await Todo.findById(req.params.id).populate('userId');
    return res.json(todoById);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getAllTodos = async (req, res) => {
  try {
    const { limit = 10, skip = 0, status } = req.query;
    const todos = await Todo.find(status ? { status } : {})
      .limit(parseInt(limit, 10))
      .skip(parseInt(skip, 2));
    res.json(todos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

const updateTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    const { title, status, tags } = req.body;
    todo.title = title || todo.title;
    todo.status = status || todo.status;
    todo.tags = tags || todo.tags;

    await todo.save();

    return res.json(todo);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

const deleteTodoById = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);

    // res.json(todo);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    if (todo.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access forbidden' });
    }
    await Todo.findByIdAndRemove(req.params.id);
    return res.status(200).json({ message: 'Todo deleted success' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTodo,
  getTodoById,
  getAllTodos,
  updateTodoById,
  deleteTodoById,
};
