const path = require('path');
const assert = require('assert');

const prismaStub = {
  user_plans: {
    async upsert(args) {
      prismaStub.calledWith = args;
      return { id: 1 };
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

const { UserPlan } = require('../models/userPlan');

(async () => {
  const { userPlan } = await UserPlan.assign(1, 2);
  assert.strictEqual(prismaStub.calledWith.where.userId, 1);
  assert.strictEqual(prismaStub.calledWith.create.planId, 2);
  assert(userPlan && userPlan.id === 1, 'UserPlan not returned');
  console.log('Test passed');
})();
