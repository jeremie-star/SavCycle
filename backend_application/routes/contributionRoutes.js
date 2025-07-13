const express = require("express");
const router = express.Router();
const contributionModel = require("../models/contributionModel");
const auth = require("../middleware/firebaseAuth");

const allowedPaymentMethods = ["mobile-money", "card"];
const allowedStatuses = ["completed", "incomplete", "pending"];

// Create a new contribution
router.post("/", auth, async (req, res) => {
  try {
    const {
      user_id,
      group_id,
      amount,
      contribution_date,  
      payment_method = 'mobile-money', 
      status = 'completed'
    } = req.body;

    // Validate required fields
    if (!user_id || !group_id || !amount) {
      return res.status(400).json({ error: "user_id, group_id and amount are required." });
    }

    // Validate payment method
    if (!allowedPaymentMethods.includes(payment_method)) {
      return res.status(400).json({ error: "Invalid payment method. Use 'mobile-money' or 'card'." });
    }

    // Validate status
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status. Use 'completed', 'incomplete', or 'pending'." });
    }

    const contribution = await contributionModel.createContribution({
      user_id,
      group_id,
      amount,
      contribution_date,
      payment_method,
      status
    });

    res.status(201).json(contribution);
  } catch (err) {
    console.error("Error creating contribution:", err);
    res.status(500).json({ error: "Failed to create contribution" });
  }
});

// Get all contributions
router.get("/", async (_, res) => {
  try {
    const contributions = await contributionModel.getAllContributions();
    res.json(contributions);
  } catch (err) {
    console.error("Error fetching contributions:", err);
    res.status(500).json({ error: "Failed to fetch contributions" });
  }
});

// Delete a contribution
router.delete("/:id", async (req, res) => {
  try {
    await contributionModel.deleteContribution(req.params.id);
    res.json({ message: "Contribution deleted" });
  } catch (err) {
    console.error("Error deleting contribution:", err);
    res.status(500).json({ error: "Failed to delete contribution" });
  }
});

module.exports = router;
