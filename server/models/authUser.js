const prisma = require("../utils/prisma");
const bcrypt = require("bcrypt");
const { makeJWT } = require("../utils/http");

const AuthUser = {
  async register({ email, password, role = "user" }) {
    try {
      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { email, hashed_password: hashed, role },
      });
      return { user, error: null };
    } catch (error) {
      console.error(error.message);
      return { user: null, error: error.message };
    }
  },

  async authenticate(email, password) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return { token: null, user: null, error: "Invalid credentials." };
      const match = await bcrypt.compare(password, user.hashed_password);
      if (!match) return { token: null, user: null, error: "Invalid credentials." };
      const token = makeJWT({ id: user.id, email: user.email, role: user.role });
      return { token, user, error: null };
    } catch (error) {
      console.error(error.message);
      return { token: null, user: null, error: error.message };
    }
  },
};

module.exports = { AuthUser };
