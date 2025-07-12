const express = require("express");
const router = express.Router();
const groupModel = require("../models/groupModel");
const auth = require("../middleware/firebaseAuth");

router.post("/", auth, async (req, res) => {
  try {
    const group = await groupModel.createGroup({ ...req.body, created_by: req.user.uid });
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (_, res) => {
  const groups = await groupModel.getAllGroups();
  res.json(groups);
});

router.get("/:id", async (req, res) => {
  const group = await groupModel.getGroupById(req.params.id);
  res.json(group);
});

router.put("/:id", async (req, res) => {
  const updated = await groupModel.updateGroup(req.params.id, req.body);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await groupModel.deleteGroup(req.params.id);
  res.json({ message: "Group deleted" });
});

module.exports = router;