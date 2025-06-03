const prisma = require("../utils/prisma");

const UserPlan = {
  assign: async function (userId, planId) {
    try {
      const userPlan = await prisma.user_plans.upsert({
        where: { userId: Number(userId) },
        update: { planId: Number(planId) },
        create: { userId: Number(userId), planId: Number(planId) },
      });
      return { userPlan, error: null };
    } catch (error) {
      console.error(error.message);
      return { userPlan: null, error: error.message };
    }
  },

  get: async function (userId) {
    try {
      const userPlan = await prisma.user_plans.findUnique({
        where: { userId: Number(userId) },
        include: { plan: true },
      });
      return userPlan || null;
    } catch (error) {
      console.error(error.message);
      return null;
    }
  },
};

module.exports = { UserPlan };
