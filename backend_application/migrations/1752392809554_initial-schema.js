exports.up = (pgm) => {
  // USERS
  pgm.createTable('users', {
    id: 'id',
    uid: { type: 'varchar(100)', notNull: true, unique: true },
    name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(100)', notNull: true, unique: true },
    phone: { type: 'varchar(20)', notNull: true },
    password_hash: { type: 'text', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('now()') }
  });

  // GROUPS
  pgm.createTable('groups', {
    id: 'id',
    name: { type: 'varchar(100)', notNull: true },
    contribution_amount: { type: 'numeric', notNull: true },
    contribution_frequency: { type: 'varchar(50)', notNull: true },
    number_of_members: { type: 'integer', notNull: true },
    payout_order: { type: 'varchar(50)', notNull: true },
    cycle_start_date: { type: 'date', notNull: true },
    group_code: { type: 'varchar(10)', notNull: true, unique: true },
    created_by: { type: 'varchar(100)', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('now()') }
  });

  // GROUP MEMBERS
  pgm.createTable('group_members', {
    id: 'id',
    group_id: { type: 'integer', references: 'groups(id)', onDelete: 'cascade', notNull: true },
    user_id: { type: 'varchar(100)', references: 'users(uid)', onDelete: 'cascade', notNull: true },
    joined_at: { type: 'timestamp', default: pgm.func('now()') }
  });

  // CONTRIBUTIONS
  pgm.createTable('contributions', {
    id: 'id',
    group_id: { type: 'integer', references: 'groups(id)', onDelete: 'cascade', notNull: true },
    user_id: { type: 'varchar(100)', references: 'users(uid)', onDelete: 'cascade', notNull: true },
    amount: { type: 'numeric', notNull: true },
    payment_method: { type: 'varchar(20)', default: 'mobile-money' },
    status: { type: 'varchar(20)', default: 'completed' },
    contributed_at: { type: 'timestamp', default: pgm.func('now()') }
  });

  // PAYOUTS
  pgm.createTable('payouts', {
    id: 'id',
    group_id: { type: 'integer', references: 'groups(id)', onDelete: 'cascade', notNull: true },
    user_id: { type: 'varchar(100)', references: 'users(uid)', onDelete: 'cascade', notNull: true },
    amount: { type: 'numeric', notNull: true },
    payout_date: { type: 'date', notNull: true },
    approved_by: { type: 'varchar(100)' },
    status: { type: 'varchar(20)', default: 'pending' }
  });

  // TRANSACTIONS
  pgm.createTable('transactions', {
    id: 'id',
    group_id: { type: 'integer', references: 'groups(id)', onDelete: 'cascade', notNull: true },
    user_id: { type: 'varchar(100)', references: 'users(uid)', onDelete: 'cascade', notNull: true },
    type: { type: 'varchar(20)', notNull: true },
    amount: { type: 'numeric', notNull: true },
    created_at: { type: 'timestamp', default: pgm.func('now()') }
  });
};

exports.down = (pgm) => {
  pgm.dropTable('transactions');
  pgm.dropTable('payouts');
  pgm.dropTable('contributions');
  pgm.dropTable('group_members');
  pgm.dropTable('groups');
  pgm.dropTable('users');
};
