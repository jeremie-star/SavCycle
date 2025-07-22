const express = require("express");
const router = express.Router();
const groupModel = require("../models/groupModel");
const pool = require("../config/db"); 
const checkAuth = require('../routes/userRoutes').checkAuth; 

// Create a new group
router.post("/", checkAuth, async (req, res) => {
  try {

    const {
      name,
      contribution_amount,
      contribution_frequency,
      number_of_members,
      payout_order,
      cycle_start_date,
    } = req.body;

    if (!name || !contribution_amount || !contribution_frequency || !number_of_members || !payout_order || !cycle_start_date) {
      console.log("Missing required fields:", {
        name,
        contribution_amount,
        contribution_frequency,
        number_of_members,
        payout_order,
        cycle_start_date,
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

});

res.status(201).json({
  ...group,
  group_code: group.group_code, 
});
} catch (err) {
    console.error("Error creating group:", err);
    res.status(500).json({ error: "Failed to create group", details: err.message });
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


router.post("/join",checkAuth, async (req, res) => {
  try {
    const { group_code } = req.body;
    const user_id = req.user.uid; 
    console.log("UID from token:", req.user.uid);
    console.log("User ID:", user_id);

    if (!group_code) {
      return res.status(400).json({ error: "group_code is required." });
    }

    // 1. Find the group by code
    const group = await groupModel.getGroupByCode(group_code);
    if (!group) {
      return res.status(404).json({ error: "Group not found." });
    }
    //  1. Check if group exists by code
    const groupResult = await groupModel.getGroupByCode(group_code);
    if (!groupResult) {
      return res.status(404).json({ error: "Group not found." });
    }
    // 2. Make sure user exists (skip if already created on signup)
    const userResult = await pool.query("SELECT id FROM users WHERE id = $1", [user_id]);
    if (userResult.rowCount === 0) {
      return res.status(404).json({ error: "User not found. Please sign up first." });
     }

    // // 3. Check if user already joined
    const existing = await pool.query(
      "SELECT * FROM group_members WHERE group_id = $1 AND user_id = $2",
      [group.id, user_id]
    );
    if (existing.rowCount > 0) {
      return res.status(409).json({ error: "User already joined the group." });
    }

    // // 4. Check if group is full
    const count = await groupModel.getGroupMemberCount(group.id);
    if (count >= group.number_of_members) {
      return res.status(400).json({ error: "Group is already full." });
    }
    // 5. Add user to group
    // await pool.query(
    //   `INSERT INTO group_members (group_id, user_id, joined_at)
    //    VALUES ($1, $2, NOW())`,
    //   [group.id, user_id]
    // );

    res.status(200).json({
      message: "Successfully joined the group.",
      group_id: group.id
    });

  } catch (err) {
    console.error("Error joining group:", err);
    res.status(500).json({ error: "Failed to join group.", details: err.message });
  }
});
// Get all groups
router.get("/", async (_, res) => {
  try {
    const groups = await groupModel.getAllGroups();
    res.json(groups);
  } catch (err) {
    console.error("Error fetching groups:", err);
    res.status(500).json({ error: "Failed to fetch groups" });
  }
});

module.exports = router;
