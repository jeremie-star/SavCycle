const express = require("express");
const router = express.Router();
const groupModel = require("../models/groupModel");
const auth = require("../middleware/firebaseAuth");

// Create a new group
router.post("/", auth, async (req, res) => {
  try {
    const {
      name,
      contribution_amount,
      contribution_frequency,
      number_of_members,
      payout_order,
      cycle_start_date
    } = req.body;

    // Ensure required fields are present (optional but good practice)
    if (!name || !contribution_amount || !contribution_frequency || !number_of_members || !payout_order || !cycle_start_date) {
      return res.status(400).json({ error: "All group fields must be provided." });
    }

    const group = await groupModel.createGroup({
      name,
      contribution_amount,
      contribution_frequency,
      number_of_members,
      payout_order,
      cycle_start_date,
      created_by: req.user.uid
    });

    res.status(201).json(group);
  } catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ error: "Failed to create group" });
  }
});

// Get all groups
router.get("/", async (_, res) => {
  try {
    const groups = await groupModel.getAllGroups();
    res.json(groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

// Get a single group by ID
router.get("/:id", async (req, res) => {
  try {
    const group = await groupModel.getGroupById(req.params.id);
    if (!group) return res.status(404).json({ error: "Group not found" });
    res.json(group);
  } catch (error) {
    console.error("Error fetching group:", error);
    res.status(500).json({ error: "Failed to fetch group" });
  }
});

// Update a group by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedGroup = await groupModel.updateGroup(req.params.id, req.body);
    if (!updatedGroup) return res.status(404).json({ error: "Group not found" });
    res.json(updatedGroup);
  } catch (error) {
    console.error("Error updating group:", error);
    res.status(500).json({ error: "Failed to update group" });
  }
});

// Delete a group by ID
router.delete("/:id", async (req, res) => {
  try {
    await groupModel.deleteGroup(req.params.id);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting group:", error);
    res.status(500).json({ error: "Failed to delete group" });
  }
});

module.exports = router;
