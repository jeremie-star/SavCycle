const express = require("express");
const router = express.Router();
const groupModel = require("../models/groupModel");
const auth = require("../middleware/firebaseAuth");
const pool = require("../config/db"); 

// Create a new group
router.post("/", auth, async (req, res) => {
  try {
    console.log("Incoming group data:", req.body);
    console.log("Authenticated user:", req.user);

    const {
      name,
      contribution_amount,
      contribution_frequency,
      number_of_members,
      payout_order,
      cycle_start_date
    } = req.body;

    if (!name || !contribution_amount || !contribution_frequency || !number_of_members || !payout_order || !cycle_start_date) {
      console.log("Missing required fields:", {
        name,
        contribution_amount,
        contribution_frequency,
        number_of_members,
        payout_order,
        cycle_start_date
      });
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

// Join a group using group_code
router.post("/join", auth, async (req, res) => {
  try {
    const { group_code } = req.body;
    const user_id = req.user.uid;

    if (!group_code) {
      return res.status(400).json({ error: "Group code is required." });
    }

    // 1. Check if group exists by code
    const groupResult = await groupModel.getGroupByCode(group_code);
    if (!groupResult) {
      return res.status(404).json({ error: "Group not found." });
    }

    // 2. Check if user exists in DB
    let userResult = await pool.query("SELECT id FROM users WHERE id = $1", [user_id]);
    if (userResult.rowCount === 0) {
      // 3. If user does not exist, create user record (minimal example)
      await pool.query(
        "INSERT INTO users (id, created_at) VALUES ($1, NOW())",
        [user_id]
      );
    }

    // 4. Check if group is full
    const currentCount = await groupModel.getGroupMemberCount(groupResult.id);
    if (currentCount >= groupResult.number_of_members) {
      return res.status(400).json({ error: "Group is already full." });
    }

    // 5. Add user to group_members
    await pool.query(
      `INSERT INTO group_members (group_id, user_id, joined_at)
       VALUES ($1, $2, NOW())`,
      [groupResult.id, user_id]
    );

    res.status(200).json({ message: "Successfully joined the group." });

  } catch (err) {
    console.error("Error joining group:", err);
    res.status(500).json({ error: "Failed to join group." });
  }
});

module.exports = router;
