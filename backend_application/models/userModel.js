const pool = require("../config/db");

module.exports = {
<<<<<<< HEAD
  createUser: async ({ id, full_name, phone_number, email, password, role }) => {
    await pool.query(
      "INSERT INTO users (id, full_name, phone_number, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
      [id, full_name, phone_number, email, password, role]
=======
  createUser: async ({ uid, name, phone, email, password, role }) => {
    await pool.query(
      "INSERT INTO users (uid, name, phone, email, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())",
      [uid, name, phone, email, password, role]
>>>>>>> 34ee52d784537dd338924ed292749c0fc016ad86
    );
  },
  getAllUsers: async () => {
    const result = await pool.query("SELECT * FROM users");
    return result.rows;
  },
  getUserByUid: async (uid) => {
    const result = await pool.query("SELECT * FROM users WHERE uid = $1", [uid]);
    return result.rows[0];
  },
  updateUser: async (uid, updates) => {
    const { name, phone, email, password, role } = updates;
    const result = await pool.query(
      `UPDATE users SET name = $1, phone = $2, email = $3, password = $4, role = $5 WHERE uid = $6 RETURNING *`,
      [name, phone, email, password, role, uid]
    );
    return result.rows[0];
  },
  deleteUser: async (uid) => {
    await pool.query("DELETE FROM users WHERE uid = $1", [uid]);
  },
};