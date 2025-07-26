const express = require("express");
const router = express.Router();
const pool = require("../config/db"); 
const groupMemberModel = require("../models/groupMemberModel");
const checkAuth = require('../routes/userRoutes').checkAuth;


// Add a member to a group
router.post("/", async (req, res) => {
  try {
    const { user_id, group_id } = req.body;
    if (!user_id || !group_id) {
      return res.status(400).json({ error: "user_id and group_id are required" });
    }
    const member = await groupMemberModel.addMember({ user_id, group_id });
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// Get all group members
router.get("/", async (_, res) => {
  try {
    const members = await groupMemberModel.getGroupMembers();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//GET /api/members/my-group → Returns group_id for logged-in user
router.get("/my-group", checkAuth, async (req, res) => {
  try {
    const userId = req.user.uid;
    console.log("🔍 User ID in /my-group:", userId);

    if (!userId) {
      return res.status(400).json({ error: "Missing user ID from token" });
    }

    const result = await pool.query(
      "SELECT group_id FROM group_members WHERE user_id = $1",
      [userId]
    );
    console.log(" DB result:", result.rows);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User is not part of any group" });
    }

    res.json({ group_id: result.rows[0].group_id });
  } catch (error) {
    console.error(" Error fetching user's group:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/group/:groupId", async (req, res) => {
  const { groupId } = req.params;
  try {
    console.log(`Fetching members for group: ${groupId}`);
    
    const result = await pool.query(
      "SELECT u.id, u.full_name FROM group_members gm JOIN users u ON gm.user_id = u.id WHERE gm.group_id = $1",
      [groupId]
    );
    
    console.log(`Found ${result.rows.length} members for group ${groupId}`);
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching group's members:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
