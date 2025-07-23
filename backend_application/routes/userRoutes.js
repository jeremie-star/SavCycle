const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const userModel = require('../models/userModel');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 

// --- Authentication middleware ---
function checkAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization header missing or malformed' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Assuming your token payload contains 'uid' as user UUID
    req.user = { uid: decoded.uid || decoded.id };
    console.log('User authenticated:', req.user.uid);
    console.log('Auth header:', req.headers.authorization);
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

router.get('/', async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    const safeUsers = users.map(({ password, ...user }) => user);
    res.json(safeUsers);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { full_name, phone_number, email, password, role } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = uuidv4();

    await userModel.createUser({
      id,
      full_name,
      phone_number,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Signup error:', err.stack || err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user by email
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, uid: user.id, },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Return token and minimal user info (no password)
    const { password: pw, ...userWithoutPassword } = user;

    res.json({ token, user: userWithoutPassword });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


module.exports = router;
module.exports.checkAuth = checkAuth;

