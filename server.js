const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express(); 

app.use(bodyParser.json());

// Database
mongoose.connect('mongodb://localhost/todo_app', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

//model
const User = mongoose.model('User', {
  username: String,
  password: String
});

// ToDo Model
const ToDo = mongoose.model('ToDo', {
  userId: String,
  task: String,
  completed: Boolean
});

// User Registration
app.post('/register', async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const user = new User({
      username: req.body.username,
      password: hashedPassword
    });
    await user.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error registering user');
  }
});

// User Login
app.post('/login', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send('User not found');
    }
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) {
      return res.status(401).send('Invalid password');
    }
    const token = jwt.sign({ userId: user._id }, 'secret');
    res.send({ token });
  } catch (error) {
    console.log(error);
    res.status(500).send('Error logging in');
  }
});

// Middleware for authentication
const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).send('Access denied. No token provided.');
  }
  try {
    const decoded = jwt.verify(token, 'secret');
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).send('Invalid token.');
  }
};

// Create
app.post('/todos', authenticateUser, async (req, res) => {
  try {
    const { task, completed } = req.body;

    if (task === undefined || completed === undefined) {
      return res.status(400).send('Task name and completion status are required.');
    }

    const todo = new ToDo({
      userId: req.user.userId,
      task,
      completed
    });

    await todo.save();
    res.status(201).send('ToDo created successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error creating ToDo');
  }
});

// Update 
app.put('/todos/:id', authenticateUser, async (req, res) => {
  try {
    const { task, completed } = req.body;

    if (task === undefined && completed === undefined) {
      return res.status(400).send('At least one field (task or completed) is required for update.');
    }

    const todo = await ToDo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: { task, completed } },
      { new: true }
    );

    if (!todo) {
      return res.status(404).send('ToDo not found');
    }

    res.send('ToDo updated successfully');
  } catch (error) {
    console.error(error);
    res.status(500).send('Error updating ToDo');
  }
})

// Delete
app.delete('/todos/:id', authenticateUser, async (req, res) => {
  try {
    const todo = await ToDo.findOneAndDelete({ _id: req.params.id, userId: req.user.userId });
    if (!todo) {
      return res.status(404).send('ToDo not found');
    }
    res.send('ToDo deleted successfully');
  } catch (error) {
    console.log(error);
    res.status(500).send('Error deleting ToDo');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
