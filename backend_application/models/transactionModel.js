const pool = require("../config/db");

module.exports = {
  createTransaction: async ({ user_id, group_id, type, amount, momo_reference }) => {
    const result = await pool.query(
      "INSERT INTO transactions (user_id, group_id, type, amount, momo_reference, created_at) VALUES ($1, $2, $3, $4, $5, NOW()) RETURNING *",
      [user_id, group_id, type, amount, momo_reference]
    );
    return result.rows[0];
  },
  getAllTransactions: async () => {
    const result = await pool.query("SELECT * FROM transactions");
    return result.rows;
  },
  deleteTransaction: async (id) => {
    await pool.query("DELETE FROM transactions WHERE id = $1", [id]);
  },
};