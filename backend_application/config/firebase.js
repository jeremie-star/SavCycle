require("dotenv").config();
const path = require("path");
const admin = require("firebase-admin");

// Load the service account JSON securely
const serviceAccount = require(process.env.GOOGLE_APPLICATION_CREDENTIALS);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
