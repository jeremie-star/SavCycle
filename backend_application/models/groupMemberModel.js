const pool = require("../config/db");

module.exports = {
  addMember: async ({ user_id, group_id }) => {
    const result = await pool.query(
      "INSERT INTO group_members (user_id, group_id, joined_at) VALUES ($1, $2, NOW()) RETURNING *",
      [user_id, group_id]
    );
    return result.rows[0];
  },
  getGroupMembers: async () => {
    const result = await pool.query("SELECT * FROM group_members");
    return result.rows;
  },
  deleteMember: async (id) => {
    await pool.query("DELETE FROM group_members WHERE id = $1", [id]);
  },
};