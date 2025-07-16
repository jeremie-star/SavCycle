require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const { swaggerUi, specs } = require('./config/swagger');

app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is running");
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api/auth", require("./auth/authRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/groups", require("./routes/groupRoutes"));
app.use("/api/members", require("./routes/groupMemberRoutes"));
app.use("/api/contributions", require("./routes/contributionRoutes"));
app.use("/api/payouts", require("./routes/payoutRoutes"));
app.use("/api/transactions", require("./routes/transactionRoutes"));

const PORT = process.env.PORT || 3001;
app.listen(PORT, ()=> console.log(`Server initiating on port ${PORT}`));