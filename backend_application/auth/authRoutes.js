// auth/authRoutes.js
const express = require('express');
const router = express.Router();
const admin = require('../config/firebase');
const userModel = require('../models/userModel');
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } = require('firebase/auth');
const { initializeApp } = require('firebase/app');
const { v4: uuidv4 } = require('uuid');

const uniqueId = uuidv4();

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication routes
 */

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - full_name
 *               - phone_number
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               full_name:
 *                 type: string
 *               phone_number:
 *                 type: string
 *               role:
 *                 type: string
 *     responses:
 *       201:
 *         description: User signed up and created in DB
 *       400:
 *         description: Bad request
 */
router.post('/signup', async (req, res) => {
    const { email, password, full_name, phone_number, role } = req.body;

    console.log(req.body);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken();
  
      const userData = {
        id: uniqueId,
        full_name,
        phone_number,
        email,
        password,
        role
      };
      await userModel.createUser(userData);
  
      res.status(201).json({ message: 'User signed up and created in DB', token });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
});

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Log in a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User logged in
 *       400:
 *         description: Invalid credentials
 */
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const token = await userCredential.user.getIdToken();
    res.status(200).json({ message: 'User logged in', token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

/**
 * @swagger
 * /api/auth/logout:
 *   post:
 *     summary: Log out a user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: User logged out
 *       400:
 *         description: Error logging out
 */
router.post('/logout', async (req, res) => {
  try {
    await signOut(auth);
    res.status(200).json({ message: 'User logged out' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;
