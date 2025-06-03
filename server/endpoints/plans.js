const { Plan } = require("../models/plan");
const { UserPlan } = require("../models/userPlan");
const { reqBody, userFromSession } = require("../utils/http");
const { validatedRequest } = require("../utils/middleware/validatedRequest");
const { strictMultiUserRoleValid, ROLES } = require("../utils/middleware/multiUserProtected");

function planEndpoints(app) {
  if (!app) return;

  app.get("/plans", async (_req, res) => {
    try {
      const plans = await Plan.where();
      res.status(200).json({ plans });
    } catch (e) {
      console.error(e);
      res.sendStatus(500).end();
    }
  });

  app.post(
    "/plans",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (req, res) => {
      try {
        const inputs = reqBody(req);
        const { plan, error } = await Plan.create(inputs);
        if (!plan) {
          res.status(400).json({ plan: null, error });
          return;
        }
        res.status(200).json({ plan, error: null });
      } catch (e) {
        console.error(e);
        res.sendStatus(500).end();
      }
    }
  );

  app.put(
    "/plans/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (req, res) => {
      try {
        const { id } = req.params;
        const updates = reqBody(req);
        const { plan, error } = await Plan.update(id, updates);
        if (!plan) {
          res.status(400).json({ plan: null, error });
          return;
        }
        res.status(200).json({ plan, error: null });
      } catch (e) {
        console.error(e);
        res.sendStatus(500).end();
      }
    }
  );

  app.delete(
    "/plans/:id",
    [validatedRequest, strictMultiUserRoleValid([ROLES.admin])],
    async (req, res) => {
      try {
        const { id } = req.params;
        const success = await Plan.delete(id);
        res.status(200).json({ success });
      } catch (e) {
        console.error(e);
        res.sendStatus(500).end();
      }
    }
  );

  app.post("/plans/change/:id", [validatedRequest], async (req, res) => {
    try {
      const { id } = req.params;
      const user = await userFromSession(req, res);
      const { userPlan, error } = await UserPlan.assign(user.id, id);
      if (!userPlan) {
        res.status(400).json({ success: false, error });
        return;
      }
      res.status(200).json({ success: true, error: null });
    } catch (e) {
      console.error(e);
      res.sendStatus(500).end();
    }
  });
}

module.exports = { planEndpoints };
