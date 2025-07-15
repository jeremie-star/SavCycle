const express = require("express");
const router = express.Router();
const transactionModel = require("../models/transactionModel");
const auth = require("../middleware/firebaseAuth");

router.post("/", auth, async (req, res) => {
  try {
    const transaction = await transactionModel.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (_, res) => {
  const transactions = await transactionModel.getAllTransactions();
  res.json(transactions);
});

router.delete("/:id", async (req, res) => {
  await transactionModel.deleteTransaction(req.params.id);
  res.json({ message: "Transaction deleted" });
});

module.exports = router;