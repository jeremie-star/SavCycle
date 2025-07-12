const express = require("express");
const router = express.Router();
const groupMemberModel = require("../models/groupMemberModel");
const auth = require("../middleware/firebaseAuth");

router.post("/", auth, async (req, res) => {
  try {
    const member = await groupMemberModel.addMember(req.body);
    res.status(201).json(member);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (_, res) => {
  const members = await groupMemberModel.getGroupMembers();
  res.json(members);
});

router.delete("/:id", async (req, res) => {
  await groupMemberModel.deleteMember(req.params.id);
  res.json({ message: "Member deleted" });
});

module.exports = router;