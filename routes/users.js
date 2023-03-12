const express = require('express');
// const joi = require('joi');

const UserController = require('../controllers/usersController');

const router = express.Router();
const authMiddleware = require('../midelwares/Auth');
const authorizeUser = require('../midelwares/authorizeUser');
const { validate, createUserValidation } = require('../midelwares/validationUsers');

// Register a new user
router.post('/users',validate(createUserValidation),UserController.createUser);

// login
router.post('/users/login',validate(createUserValidation), UserController.loginUser);

// Get all users
router.get('/users', authMiddleware, UserController.getAllUsers);

// Get a specific user
router.get('/users/:id',authMiddleware,authorizeUser,UserController.getUserById);

// Delete a specific user
router.delete('/users/:id', authMiddleware,authorizeUser,UserController.deleteUserById);

// Update a specific user
router.patch('/users/:id', authMiddleware,authorizeUser,UserController.updateUserById);

router.get('/:userId/todos', authMiddleware, UserController.getTodosByUserId);

module.exports = router;
