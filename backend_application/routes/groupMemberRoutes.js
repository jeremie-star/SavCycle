const express = require("express");
const router = express.Router();
const groupMemberModel = require("../models/groupMemberModel");
const auth = require("../middleware/firebaseAuth");

/**
 * @swagger
 * tags:
 *   name: Group Members
 *   description: Group membership management
 */

/**
 * @swagger
 * /api/group-members:
 *   post:
 *     summary: Add a user to a group
 *     tags: [Group Members]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - group_id
 *             properties:
 *               user_id:
 *                 type: string
 *               group_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Member added to the group
 */

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

/**
 * @swagger
 * /api/group-members:
 *   get:
 *     summary: Retrieve all group members
 *     tags: [Group Members]
 *     responses:
 *       200:
 *         description: A list of group members
 */

// Get all group members (only authenticated users)
router.get("/", auth, async (_, res) => {
  try {
    const members = await groupMemberModel.getGroupMembers();
    res.json(members);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * @swagger
 * /api/group-members/{id}:
 *   delete:
 *     summary: Remove a member from a group by ID
 *     tags: [Group Members]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Member ID
 *     responses:
 *       200:
 *         description: Member removed from group
 */

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
