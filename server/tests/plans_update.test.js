const path = require('path');
const assert = require('assert');

const prismaStub = {
  plans: {
    async update({ where, data }) {
      prismaStub.calledWith = { where, data };
      return { id: where.id, ...data };
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
  const { plan } = await Plan.update(1, { name: 'Pro', price: 20 });
  assert.deepStrictEqual(prismaStub.calledWith, { where: { id: 1 }, data: { name: 'Pro', price: 20 } });
  assert(plan && plan.id === 1, 'Plan not returned');
  console.log('Test passed');
})();
