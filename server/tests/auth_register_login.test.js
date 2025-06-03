const assert = require('assert');
const path = require('path');
const bcrypt = require('bcrypt');

const prismaStub = {
  user: {
    async create({ data }) {
      prismaStub.created = data;
      return { id: 1, ...data };
    },
    async findUnique({ where }) {
      if (prismaStub.created && prismaStub.created.email === where.email) {
        return { id: 1, ...prismaStub.created };
      }
      return null;
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

process.env.JWT_SECRET = 'secret';
const { AuthUser } = require('../models/authUser');

(async () => {
  const { user } = await AuthUser.register({ email: 'a@test.com', password: 'pw' });
  assert(user && user.id === 1, 'User not created');
  assert.notStrictEqual(prismaStub.created.hashed_password, 'pw');
  const ok = await bcrypt.compare('pw', prismaStub.created.hashed_password);
  assert.ok(ok, 'Password not hashed');

  const { token } = await AuthUser.authenticate('a@test.com', 'pw');
  assert.ok(token, 'Token not returned');
  console.log('Test passed');
})();
