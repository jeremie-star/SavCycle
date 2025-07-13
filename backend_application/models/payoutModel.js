const pool = require("../config/db");

module.exports = {
  createPayout: async ({ group_id, user_id, amount, payout_date, approved_by, status }) => {
    const result = await pool.query(
      "INSERT INTO payouts (group_id, user_id, amount, payout_date, approved_by, status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [group_id, user_id, amount, payout_date, approved_by, status]
    );
    return result.rows[0];
  },
  getAllPayouts: async () => {
    const result = await pool.query("SELECT * FROM payouts");
    return result.rows;
  },
  deletePayout: async (id) => {
    await pool.query("DELETE FROM payouts WHERE id = $1", [id]);
  },
};