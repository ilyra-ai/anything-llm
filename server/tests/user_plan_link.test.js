const path = require('path');
const assert = require('assert');
const bcrypt = require('bcrypt');

const prismaStub = {
  user: {
    async create({ data }) {
      prismaStub.userCreated = data;
      return { id: 1, ...data };
    },
  },
  plans: {
    async findFirst({ where }) {
      if (where.name === 'Free') return { id: 2, name: 'Free' };
      return null;
    },
    async create({ data }) {
      prismaStub.planCreated = data;
      return { id: 2, ...data };
    },
  },
  user_plans: {
    async upsert(args) {
      prismaStub.upsertArgs = args;
      return { id: 3 };
    },
  },
};

const prismaPath = path.join(__dirname, '../utils/prisma');
require.cache[require.resolve(prismaPath)] = {
  id: prismaPath,
  filename: prismaPath,
  loaded: true,
  exports: prismaStub,
};

const { AuthUser } = require('../models/authUser');

(async () => {
  await AuthUser.register({ email: 'a@test.com', password: 'pw' });
  assert.ok(prismaStub.upsertArgs, 'Plan not assigned');
  assert.strictEqual(prismaStub.upsertArgs.create.planId, 2);
  const ok = await bcrypt.compare('pw', prismaStub.userCreated.hashed_password);
  assert.ok(ok, 'Password not hashed');
  console.log('Test passed');
})();
