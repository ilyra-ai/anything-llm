const { reqBody } = require("../utils/http");
const { AuthUser } = require("../models/authUser");

function authEndpoints(app) {
  if (!app) return;

  app.post("/auth/register", async (request, response) => {
    try {
      const { email, password, role } = reqBody(request);
      const { user, error } = await AuthUser.register({ email, password, role });
      if (!user) {
        response.status(400).json({ user: null, error });
        return;
      }
      const { hashed_password, ...rest } = user;
      response.status(200).json({ user: rest, error: null });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });

  app.post("/auth/login", async (request, response) => {
    try {
      const { email, password } = reqBody(request);
      const { token, user, error } = await AuthUser.authenticate(email, password);
      if (!token) {
        response.status(400).json({ token: null, error });
        return;
      }
      response.status(200).json({ token });
    } catch (e) {
      console.error(e);
      response.sendStatus(500).end();
    }
  });
}

module.exports = { authEndpoints };
