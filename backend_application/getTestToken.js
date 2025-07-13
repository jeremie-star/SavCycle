require("dotenv").config();
const { initializeApp } = require("firebase/app");
const { getAuth, signInWithEmailAndPassword } = require("firebase/auth");

const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID,
    measurementId: process.env.FIREBASE_MEASUREMENT_ID
};

const clientApp = initializeApp(firebaseConfig);
const clientAuth = getAuth(clientApp);

signInWithEmailAndPassword(clientAuth, process.env.TEST_EMAIL, process.env.TEST_PASSWORD)
  .then(userCredential => userCredential.user.getIdToken())
  .then(token => {
    console.log("🔑 Firebase ID Token (for testing):");
    console.log(token);
  })
  .catch(err => console.error("Firebase test login failed:", err.message));
