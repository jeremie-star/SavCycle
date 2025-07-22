const pool = require("../config/db");

module.exports = {
   createUser: async ({ id, full_name, phone_number, email, password, role }) => {
    try {
      await pool.query(
        "INSERT INTO users (id, full_name, phone_number, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
        [id, full_name, phone_number, email, password, role]
      );
    } catch (error) {
      console.error("DB insert error:", error.message || error);
      throw error; // rethrow to catch in route handler
    }
  },
  getAllUsers: async () => {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  },
  getUserById: async (id) => {
  const result = await pool.query("SELECT * FROM users WHERE id = $1", [id]);
  return result.rows[0];
},
  updateUser: async (id, updates) => {
  const { full_name, phone_number, email, password, role } = updates;
  const result = await pool.query(
    `UPDATE users SET full_name = $1, phone_number = $2, email = $3, password = $4, role = $5 WHERE id = $6 RETURNING *`,
    [full_name, phone_number, email, password, role, id]
  );
  return result.rows[0];
},
  deleteUser: async (id) => {
    await pool.query("DELETE FROM users WHERE id = $1", [id]);
  },
};