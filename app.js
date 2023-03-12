require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const users = require('./routes/users');
const todos = require('./routes/todos');
const comment = require('./routes/comment');

// const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
// app.use(cors());
const URI = process.env.MONGODB_URI;
// Connect to MongoDB
mongoose.connect(URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err.message));

// Routes
app.use('/api/todos', todos);
app.use('/api/', users);
app.use('/api/comment', comment);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
