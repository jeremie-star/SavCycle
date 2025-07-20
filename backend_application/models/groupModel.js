const pool = require("../config/db");

// Utility function to generate a unique group code
function generateGroupCode() {
  return Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
}
async function generateUniqueGroupCode() {
  let code;
  let exists = true;
  while (exists) {
    code = generateGroupCode();
    const check = await pool.query("SELECT id FROM groups WHERE group_code = $1", [code]);
    if (check.rowCount === 0) exists = false;
  }
  return code;
}

async function joinGroup(user_id, group_code) {
  // 1. Get group id from group_code (integer)
  const groupResult = await pool.query('SELECT id FROM groups WHERE group_code = $1', [group_code]);
  if (groupResult.rows.length === 0) {
    throw new Error('Group not found');
  }
  const group_id = groupResult.rows[0].id;

  // 2. Insert into group_members with correct types
  await pool.query(
    'INSERT INTO group_members (group_id, user_id) VALUES ($1, $2)',
    [group_id, user_id]
  );
}


module.exports = {
  createGroup: async ({ 
  name, 
  contribution_amount,   
  contribution_frequency, 
  number_of_members,    
  payout_order,          
  cycle_start_date,
  created_by              
}) => {
  const group_code = await generateUniqueGroupCode();

  const result = await pool.query(
    `INSERT INTO groups 
      (name, contribution_amount, contribution_frequency, number_of_members, payout_order, cycle_start_date, group_code, created_by, created_at) 
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW()) 
     RETURNING *`,
    [
      name,
      contribution_amount,
      contribution_frequency,
      number_of_members,
      payout_order,
      cycle_start_date,
      group_code,
      created_by
    ]
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
    const { name, contribution_amount, contribution_frequency, number_of_members, payout_order, cycle_start_date } = updates;
    const result = await pool.query(
      `UPDATE groups 
       SET name = $1, contribution_amount = $2, contribution_frequency = $3, number_of_members = $4, payout_order = $5, cycle_start_date = $6
       WHERE id = $7 RETURNING *`,
      [name, contribution_amount, contribution_frequency, number_of_members, payout_order, cycle_start_date, id]
    );
    return result.rows[0];
  },

  deleteGroup: async (id) => {
    await pool.query("DELETE FROM groups WHERE id = $1", [id]);
  },

  getGroupMemberCount: async (group_id) => {
  const result = await pool.query(
    `SELECT COUNT(*) FROM group_members WHERE group_id = $1`, 
    [group_id]
  );
  return parseInt(result.rows[0].count, 10);
},

  getGroupByCode: async (group_code) => {
  const result = await pool.query("SELECT * FROM groups WHERE group_code = $1", [group_code]);
  return result.rows[0];
}
};
