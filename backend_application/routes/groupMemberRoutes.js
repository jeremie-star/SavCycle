const express = require("express");
const router = express.Router();
const groupMemberModel = require("../models/groupMemberModel");
const auth = require("../middleware/firebaseAuth");

// Add a member to a group
router.post("/", auth, async (req, res) => {
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

// Get all group members (only authenticated users)
router.get("/", auth, async (_, res) => {
  try {
    const members = await groupMemberModel.getGroupMembers();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a group member by ID (only authenticated users)
router.delete("/:id", auth, async (req, res) => {
  try {
    await groupMemberModel.deleteMember(req.params.id);
    res.json({ message: "Member deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
