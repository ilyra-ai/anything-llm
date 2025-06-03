const assert = require('assert');
const path = require('path');

process.env.JWT_SECRET = 'secret';

const httpPath = path.join(__dirname, '../utils/http');
require.cache[require.resolve(httpPath)] = {
  id: httpPath,
  filename: httpPath,
  loaded: true,
  exports: { decodeJWT: () => ({ id: 1 }) },
};

const userPath = path.join(__dirname, '../models/user');
let getCalled = false;
require.cache[require.resolve(userPath)] = {
  id: userPath,
  filename: userPath,
  loaded: true,
  exports: { User: { get: async () => { getCalled = true; return { id: 1, role: 'admin' }; } } },
};

const { auth, requireRole } = require('../middleware/auth');

(async () => {
  const req = { header: () => null };
  let status;
  const res = { status(s){ status = s; return { json(){ } }; } };
  let nextCalled = false;
  await auth(req, res, () => { nextCalled = true; });
  assert.strictEqual(status, 401);
  assert.strictEqual(nextCalled, false);

  req.header = () => 'Bearer token';
  status = undefined; nextCalled = false; getCalled = false;
  await auth(req, res, () => { nextCalled = true; });
  assert.strictEqual(status, undefined);
  assert.ok(nextCalled);
  assert.ok(getCalled);
  assert.deepStrictEqual(req.user, { id: 1, role: 'admin' });

  nextCalled = false; status = undefined;
  await requireRole('admin')(req, res, () => { nextCalled = true; });
  assert.ok(nextCalled);

  req.user.role = 'user';
  nextCalled = false;
  await requireRole('admin')(req, res, () => { nextCalled = true; });
  assert.strictEqual(status, 403);
  assert.strictEqual(nextCalled, false);
  console.log('Test passed');
})();
