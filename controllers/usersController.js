/* eslint-disable import/no-extraneous-dependencies */
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/users');
const Todo = require('../models/todo');

// const validationMiddleware = require('../midelwares/handelError');
// const userSchema = joi.object({
//   username: joi.string().required(),
//   password: joi.string().required(),
//   firstName: joi.string().required(),
//   lastName: joi.string().required(),
//   dob: joi.date().optional(),
// });
// ,validationMiddleware(userSchema)

const createUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const {
      username, password, firstName, lastName, dob,
    } = req.body;
    const existingUser = await User.findOne({ username }) || null;
    if (existingUser) {
      return res.status(400).json({ message: 'username has already exist User' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      firstName,
      lastName,
      dob,
    });
    await user.save();
    // const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1w' });
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}, 'firstName');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    // Check if the authenticated user ID matches the requested user ID
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json({ message: 'User deleted sucess' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const updateUserById = async (req, res) => {
  try {
    const {
      username, password, firstName, lastName, dob,role,
    } = req.body;
    const { id } = req.params;
    if (req.user.id !== id) {
      return res.status(403).json({ message: 'You are not authorized to access this resource' });
    }
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      {
        username,
        password,
        firstName,
        lastName,
        dob,
        role,
      },
      {
        new: true,
      },
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.json({ message: 'User  updateing  successfully', user });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getTodosByUserId = async (req, res) => {
  try {
    if (req.user.role !== 'user') {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    const todos = await Todo.find({ userId: req.params.userId });
    return res.json(todos);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: error.message });
  }
};

// eslint-disable-next-line consistent-return
const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    console.log(validPassword);
    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const payload = {
      // eslint-disable-next-line no-underscore-dangle
      id: user._id,
      name: user.name,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1w' });
    // Create and sign JWT token
    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  deleteUserById,
  updateUserById,
  getTodosByUserId,
  loginUser,
};
