const express = require("express");
const router = express.Router();
const transactionModel = require("../models/transactionModel");
const auth = require("../middleware/firebaseAuth");

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management
 */

/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - group_id
 *               - type
 *               - amount
 *               - momo_reference
 *             properties:
 *               user_id:
 *                 type: string
 *               group_id:
 *                 type: string
 *               type:
 *                 type: string
 *               amount:
 *                 type: number
 *               momo_reference:
 *                 type: string
 *     responses:
 *       201:
 *         description: Transaction created
 */

router.post("/", auth, async (req, res) => {
  try {
    const transaction = await transactionModel.createTransaction(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/transactions:
 *   get:
 *     summary: Retrieve all transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: A list of transactions
 */

router.get("/", async (_, res) => {
  const transactions = await transactionModel.getAllTransactions();
  res.json(transactions);
});

/**
 * @swagger
 * /api/transactions/{id}:
 *   delete:
 *     summary: Delete a transaction by ID
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Transaction ID
 *     responses:
 *       200:
 *         description: Transaction deleted
 */ 

router.delete("/:id", async (req, res) => {
  await transactionModel.deleteTransaction(req.params.id);
  res.json({ message: "Transaction deleted" });
});

module.exports = router;