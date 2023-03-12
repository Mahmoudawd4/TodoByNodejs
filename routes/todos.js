const express = require('express');
const todoController = require('../controllers/todoController');
const asycnWrapper = require('../lib/helperFunction');
// const asyncWrapper = require('../lib/helperFunction');
const authMiddleware = require('../midelwares/Auth');
const isAdminAuthMiddleware = require('../midelwares/isAdmin');
const router = express.Router();

// Create a new Todo
// router.post('/', todoController.createTodo);

router.post(
  '/',
  async (req, res) => {
    const {
      body: {
        title, status, tags, userId,
      },
    } = req;
    const todo = todoController.createTodo({
      title, status, tags, userId,
    });
    const [err, data] = await asycnWrapper(todo);
    if (err) return res.status(500).json({ message: err.message });
    return res.json(data);
  },
);
const User = require('../models/users');

// Get a single Todo by id

router.get('/:id', authMiddleware,todoController.getTodoById);

// router.get(
//   '/:id',
//   authMiddleware,async (req, res) => {
//     const { id } = req.params;
//     const todo = todoController.getTodoById(id);
//     const [err, data] = await asycnWrapper(todo);
//     if (err) return res.status(500).json({ message: err.message });
//     return res.json(data);
//   },
// );

// Get all Todos with optional filters
router.get('/',isAdminAuthMiddleware,todoController.getAllTodos);

// router.get(
//   '/',
//   async (req, res) => {
//     const { limit = 10, skip = 0, status } = req.query;
//     if (status) {
//         req.query.status = status;
//   }
//     const todo = todoController.getAllTodos(limit,skip,status);
//     const [err, data] = await asycnWrapper(todo);
//     if (err) return res.status(500).json({ message: err.message });
//     return res.json(data);
//   }
// );

// Update a Todo by id
router.patch('/:id',authMiddleware,todoController.updateTodoById);

// Delete a Todo by id
router.delete('/:id',authMiddleware, todoController.deleteTodoById);

module.exports = router;
