const admin = require("../config/firebase");

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    console.log("No Authorization header");
    return res.status(403).json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    console.log("No token found in Authorization header");
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    const decoded = await admin.auth().verifyIdToken(token);
    console.log("Token verified:", decoded.uid);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Token verification failed:", err);
    res.status(401).json({ message: "Unauthorized" });
  }
};
