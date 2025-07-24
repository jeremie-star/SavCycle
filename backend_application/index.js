require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Route imports
const userRoutes = require('./routes/userRoutes');
const groupRoutes = require('./routes/groupRoutes');
const groupMemberRoutes = require('./routes/groupMemberRoutes');
const contributionRoutes = require('./routes/contributionRoutes');
const payoutRoutes = require('./routes/payoutRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Health check route
app.get("/", (req, res) => {
  res.send("Server is running");
});

// Route registrations
app.use("/api/users", userRoutes);
// app.use("/api/users/signin", userRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api/members", groupMemberRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/payouts", payoutRoutes);
app.use("/api/transactions", transactionRoutes);

// Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server initiating on port ${PORT}`));
