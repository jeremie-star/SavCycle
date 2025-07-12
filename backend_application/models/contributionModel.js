const pool = require("../config/db");

module.exports = {
  createContribution: async ({ user_id, group_id, amount, contribution_date, payment_method, status }) => {
    const result = await pool.query(
      "INSERT INTO contributions (user_id, group_id, amount, contribution_date, payment_method, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [user_id, group_id, amount, contribution_date, payment_method, status]
    );
    return result.rows[0];
  },
  getAllContributions: async () => {
    const result = await pool.query("SELECT * FROM contributions");
    return result.rows;
  },
  deleteContribution: async (id) => {
    await pool.query("DELETE FROM contributions WHERE id = $1", [id]);
  },
};
