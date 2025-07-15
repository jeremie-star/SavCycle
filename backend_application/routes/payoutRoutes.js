const express = require("express");
const router = express.Router();
const payoutModel = require("../models/payoutModel");
const auth = require("../middleware/firebaseAuth");

router.post("/", auth, async (req, res) => {
  try {
    const payout = await payoutModel.createPayout(req.body);
    res.status(201).json(payout);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (_, res) => {
  const payouts = await payoutModel.getAllPayouts();
  res.json(payouts);
});

router.delete("/:id", async (req, res) => {
  await payoutModel.deletePayout(req.params.id);
  res.json({ message: "Payout deleted" });
});

module.exports = router;