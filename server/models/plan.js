const prisma = require("../utils/prisma");

const Plan = {
  create: async function (inputs = {}) {
    try {
      const plan = await prisma.plans.create({ data: inputs });
      return { plan, error: null };
    } catch (error) {
      console.error(error.message);
      return { plan: null, error: error.message };
    }
  },

  update: async function (id = null, updates = {}) {
    try {
      const plan = await prisma.plans.update({ where: { id: Number(id) }, data: updates });
      return { plan, error: null };
    } catch (error) {
      console.error(error.message);
      return { plan: null, error: error.message };
    }
  },

  delete: async function (id = null) {
    try {
      await prisma.plans.delete({ where: { id: Number(id) } });
      return true;
    } catch (error) {
      console.error(error.message);
      return false;
    }
  },

  get: async function (clause = {}) {
    try {
      const plan = await prisma.plans.findFirst({ where: clause });
      return plan || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },

  where: async function (clause = {}) {
    try {
      const plans = await prisma.plans.findMany({ where: clause });
      return plans;
    } catch (error) {
      console.error(error.message);
      return [];
    }
  },
};

module.exports = { Plan };
