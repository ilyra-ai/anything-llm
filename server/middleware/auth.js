const { decodeJWT } = require("../utils/http");
const { User } = require("../models/user");

async function auth(req, res, next) {
  const authHeader = req.header("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;
  if (!token) {
    res.status(401).json({ error: "No auth token found." });
    return;
  }
  const payload = decodeJWT(token);
  if (!payload || !payload.id) {
    res.status(401).json({ error: "Invalid auth token." });
    return;
  }
  const user = await User.get({ id: payload.id });
  if (!user) {
    res.status(401).json({ error: "Invalid auth user." });
    return;
  }
  req.user = user;
  next();
}

function requireRole(role) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      res.status(403).json({ error: "Forbidden" });
      return;
    }
    next();
  };
}

module.exports = { auth, requireRole };
