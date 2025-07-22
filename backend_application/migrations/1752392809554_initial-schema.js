exports.up = (pgm) => {
  pgm.sql('CREATE EXTENSION IF NOT EXISTS "pgcrypto";');

  // USERS
  pgm.createTable('users', {
    id: { type: 'uuid', default: pgm.func('gen_random_uuid()') },  // just extra col, no PK
    uid: { type: 'uuid', primaryKey: true, notNull: true, unique: true, default: pgm.func('gen_random_uuid()') },  // PK column
    full_name: { type: 'varchar(100)', notNull: true },
    email: { type: 'varchar(100)', notNull: true, unique: true },
    phone_number: { type: 'varchar(20)', notNull: true },
    password: { type: 'text', notNull: true },
    role: { type: 'varchar(20)', notNull: true, default: "'member'" }, 
    created_at: { type: 'timestamp', default: pgm.func('now()') }
  });

  // GROUPS
  pgm.createTable('groups', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    name: { type: 'varchar(100)', notNull: true },
    contribution_amount: { type: 'numeric', notNull: true },
    contribution_frequency: { type: 'varchar(50)', notNull: true },
    number_of_members: { type: 'integer', notNull: true },
    payout_order: { type: 'varchar(50)', notNull: true },
    cycle_start_date: { type: 'date', notNull: true },
    group_code: { type: 'varchar(10)', notNull: true, unique: true },
    created_at: { type: 'timestamp', default: pgm.func('now()') }
  });

  // GROUP MEMBERS
  pgm.createTable('group_members', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    group_id: { type: 'uuid', references: 'groups(id)', onDelete: 'cascade', notNull: true },
    user_id: { type: 'uuid', references: 'users(uid)', onDelete: 'cascade', notNull: true },
    joined_at: { type: 'timestamp', default: pgm.func('now()') }
  });

  // CONTRIBUTIONS
  pgm.createTable('contributions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    group_id: { type: 'uuid', references: 'groups(id)', onDelete: 'cascade', notNull: true },
    user_id: { type: 'uuid', references: 'users(uid)', onDelete: 'cascade', notNull: true },
    amount: { type: 'numeric', notNull: true },
    payment_method: { type: 'varchar(20)', default: 'mobile-money' },
    status: { type: 'varchar(20)', default: 'completed' },
    contributed_at: { type: 'timestamp', default: pgm.func('now()') }
  });

  // PAYOUTS
  pgm.createTable('payouts', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    group_id: { type: 'uuid', references: 'groups(id)', onDelete: 'cascade', notNull: true },
    user_id: { type: 'uuid', references: 'users(uid)', onDelete: 'cascade', notNull: true },
    amount: { type: 'numeric', notNull: true },
    payout_date: { type: 'date', notNull: true },
    approved_by: { type: 'uuid', references: 'users(uid)' }, // optional FK
    status: { type: 'varchar(20)', default: 'pending' }
  });

  // TRANSACTIONS
  pgm.createTable('transactions', {
    id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
    group_id: { type: 'uuid', references: 'groups(id)', onDelete: 'cascade', notNull: true },
    user_id: { type: 'uuid', references: 'users(uid)', onDelete: 'cascade', notNull: true },
    type: { type: 'varchar(20)', notNull: true },
    amount: { type: 'numeric', notNull: true },
    momo_reference: { type: 'varchar(100)' },
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
