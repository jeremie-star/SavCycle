const pool = require("../config/db");

module.exports = {
  createGroup: async ({ name, description, cycle_start_date, cycle_end_date, created_by }) => {
    const result = await pool.query(
      "INSERT INTO groups (name, description, cycle_start_date, cycle_end_date, created_by, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [name, description, cycle_start_date, cycle_end_date, created_by]
    );
    return result.rows[0];
  },
  getAllGroups: async () => {
    const result = await pool.query("SELECT * FROM groups");
    return result.rows;
  },
  getGroupById: async (id) => {
    const result = await pool.query("SELECT * FROM groups WHERE id = $1", [id]);
    return result.rows[0];
  },
  updateGroup: async (id, updates) => {
    const { name, description, cycle_start_date, cycle_end_date } = updates;
    const result = await pool.query(
      `UPDATE groups SET name = $1, description = $2, cycle_start_date = $3, cycle_end_date = $4 WHERE id = $5 RETURNING *`,
      [name, description, cycle_start_date, cycle_end_date, id]
    );
    return result.rows[0];
  },
  deleteGroup: async (id) => {
    await pool.query("DELETE FROM groups WHERE id = $1", [id]);
  },
};