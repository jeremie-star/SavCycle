const express = require("express");
const router = express.Router();
const payoutModel = require("../models/payoutModel");
const auth = require("../middleware/firebaseAuth");

/**
 * @swagger
 * tags:
 *   name: Payouts
 *   description: Payout management
 */

/**
 * @swagger
 * /api/payouts:
 *   post:
 *     summary: Create a new payout
 *     tags: [Payouts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - group_id
 *               - user_id
 *               - amount
 *               - payout_date
 *               - approved_by
 *               - status
 *             properties:
 *               group_id:
 *                 type: string
 *               user_id:
 *                 type: string
 *               amount:
 *                 type: number
 *               payout_date:
 *                 type: string
 *                 format: date
 *               approved_by:
 *                 type: string
 *               status:
 *                 type: string
 *     responses:
 *       201:
 *         description: Payout created
 */

router.post("/", auth, async (req, res) => {
  try {
    const payout = await payoutModel.createPayout(req.body);
    res.status(201).json(payout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/payouts:
 *   get:
 *     summary: Retrieve all payouts
 *     tags: [Payouts]
 *     responses:
 *       200:
 *         description: A list of payouts
 */

router.get("/", async (_, res) => {
  const payouts = await payoutModel.getAllPayouts();
  res.json(payouts);
});

/**
 * @swagger
 * /api/payouts/{id}:
 *   delete:
 *     summary: Delete a payout by ID
 *     tags: [Payouts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Payout ID
 *     responses:
 *       200:
 *         description: Payout deleted
 */

router.delete("/:id", async (req, res) => {
  await payoutModel.deletePayout(req.params.id);
  res.json({ message: "Payout deleted" });
});

module.exports = router;