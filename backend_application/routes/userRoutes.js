const express = require("express");
const router = express.Router();
const userModel = require("../models/userModel");
const auth = require("../middleware/firebaseAuth");

router.post("/", auth ,async (req, res) => {
  try {
    await userModel.createUser({ id: req.user.uid, ...req.body });
    res.status(201).json({ message: "User created" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (_, res) => {
  const users = await userModel.getAllUsers();
  res.json(users);
});

router.get("/:id", async (req, res) => {
  const user = await userModel.getUserById(req.params.id);
  res.json(user);
});

router.put("/:id", async (req, res) => {
  const updated = await userModel.updateUser(req.params.id, req.body);
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await userModel.deleteUser(req.params.id);
  res.json({ message: "User deleted" });
});

module.exports = router;