require("dotenv").config();
const path = require("path");
const admin = require("firebase-admin");

// Build an absolute path based on __dirname
const serviceAccountPath = path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS);

// Load the service account JSON securely
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
