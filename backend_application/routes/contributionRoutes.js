const express = require("express");
const router = express.Router();
const contributionModel = require("../models/contributionModel");
const { checkAuth } = require("./userRoutes");

const allowedPaymentMethods = ["mobile-money", "card"];
const allowedStatuses = ["completed", "incomplete", "pending"];

router.post("/:group_id",checkAuth, async (req, res) => {
  try {
    const {
      amount,
      contribution_date,  
      payment_method = 'mobile-money', 
      status = 'completed'
    } = req.body;

    const group_id = req.params.group_id;
    const user_id = req.user?.uid;

    // Validate required fields
    if (!amount || !group_id || !user_id) {
      return res.status(400).json({ error: "Missing required fields (amount, group_id, or user_id)." });
    }

    if (!allowedPaymentMethods.includes(payment_method)) {
      return res.status(400).json({ error: "Invalid payment method. Use 'mobile-money' or 'card'." });
    }

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
  res.status(500).json({ error: "Database error", details: dbError.message });
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
