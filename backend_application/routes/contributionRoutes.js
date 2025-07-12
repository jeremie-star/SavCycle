const express = require("express");
const router = express.Router();
const contributionModel = require("../models/contributionModel");
const auth = require("../middleware/firebaseAuth");

router.post("/", auth, async (req, res) => {
  try {
    const contribution = await contributionModel.createContribution(req.body);
    res.status(201).json(contribution);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (_, res) => {
  const contributions = await contributionModel.getAllContributions();
  res.json(contributions);
});

router.delete("/:id", async (req, res) => {
  await contributionModel.deleteContribution(req.params.id);
  res.json({ message: "Contribution deleted" });
});

module.exports = router;