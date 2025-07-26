const pool = require("../config/db");

module.exports = {
  // Create a new contribution
 createContribution: async ({ user_id, group_id, amount, contributed_at, payment_method, status }) => {
  const result = await pool.query(
    `INSERT INTO contributions 
      (user_id, group_id, amount, contributed_at, payment_method, status) 
     VALUES ($1, $2, $3, $4, $5, $6) 
     RETURNING *`,
    [user_id, group_id, amount, contributed_at, payment_method, status]
  );
  return result.rows[0];
},

getAllContributions: async () => {
  const result = await pool.query("SELECT * FROM contributions ORDER BY contributed_at DESC");
  return result.rows;
},

getContributionsByGroupId: async (group_id) => {
  const result = await pool.query(
    "SELECT * FROM contributions WHERE group_id = $1 ORDER BY contributed_at DESC",
    [group_id]
  );
  return result.rows;
},

getContributionsByUserId: async (user_id) => {
  const result = await pool.query(
    "SELECT * FROM contributions WHERE user_id = $1 ORDER BY contributed_at DESC",
    [user_id]
  );
  return result.rows;
},

updateContribution: async (id, updates) => {
  const {
    amount,
    contributed_at,
    payment_method,
    status
  } = updates;

  const result = await pool.query(
    `UPDATE contributions 
     SET amount = $1,
         contributed_at = $2,
         payment_method = $3,
         status = $4
     WHERE id = $5
     RETURNING *`,
    [amount, contributed_at, payment_method, status, id]
  );
  return result.rows[0];
},


  // Delete a contribution by ID
  deleteContribution: async (id) => {
    await pool.query("DELETE FROM contributions WHERE id = $1", [id]);
  },
};
