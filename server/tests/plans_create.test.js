const path = require('path');
const assert = require('assert');

const prismaStub = {
  plans: {
    async create({ data }) {
      prismaStub.created = data;
      return { id: 1, ...data };
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

const { Plan } = require('../models/plan');

(async () => {
  const { plan } = await Plan.create({ name: 'Pro', price: 10 });
  assert.deepStrictEqual(prismaStub.created, { name: 'Pro', price: 10 });
  assert(plan && plan.id === 1, 'Plan not returned');
  console.log('Test passed');
})();
