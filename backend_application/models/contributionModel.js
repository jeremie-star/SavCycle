const pool = require("../config/db");

module.exports = {
  // Create a new contribution
  createContribution: async ({ user_id, group_id, amount, contribution_date, payment_method, status }) => {
    const result = await pool.query(
      `INSERT INTO contributions 
        (user_id, group_id, amount, contribution_date, payment_method, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [user_id, group_id, amount, contribution_date, payment_method, status]
    );
    return result.rows[0];
  },

  // Get all contributions
  getAllContributions: async () => {
    const result = await pool.query("SELECT * FROM contributions ORDER BY contribution_date DESC");
    return result.rows;
  },

  // Get a single contribution by ID
  getContributionById: async (id) => {
    const result = await pool.query("SELECT * FROM contributions WHERE id = $1", [id]);
    return result.rows[0];
  },

  // Get all contributions for a specific group
  getContributionsByGroupId: async (group_id) => {
    const result = await pool.query(
      "SELECT * FROM contributions WHERE group_id = $1 ORDER BY contribution_date DESC",
      [group_id]
    );
    return result.rows;
  },

  // Get all contributions for a specific user
  getContributionsByUserId: async (user_id) => {
    const result = await pool.query(
      "SELECT * FROM contributions WHERE user_id = $1 ORDER BY contribution_date DESC",
      [user_id]
    );
    return result.rows;
  },

  // Update a contribution by ID
  updateContribution: async (id, updates) => {
    const {
      amount,
      contribution_date,
      payment_method,
      status
    } = updates;

    const result = await pool.query(
      `UPDATE contributions 
       SET amount = $1,
           contribution_date = $2,
           payment_method = $3,
           status = $4
       WHERE id = $5
       RETURNING *`,
      [amount, contribution_date, payment_method, status, id]
    );
    return result.rows[0];
  },

  // Delete a contribution by ID
  deleteContribution: async (id) => {
    await pool.query("DELETE FROM contributions WHERE id = $1", [id]);
  },
};
