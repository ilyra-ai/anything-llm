
const path = require('path');
const assert = require('assert');

const prismaStub = {
  workspace_chats: {
    async createMany({ data }) {
      prismaStub.calledWith = data;
      return { count: data.length };
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

const { WorkspaceChats } = require('../models/workspaceChats');

(async () => {
  const data = [
    { workspaceId: 1, prompt: 'p', response: '{}', user_id: 1 },
    { workspaceId: 1, prompt: 'q', response: '{}', user_id: 1 },
  ];
  const res = await WorkspaceChats.bulkCreate(data);
  assert.deepStrictEqual(prismaStub.calledWith, data, 'createMany called with incorrect data');
  assert.strictEqual(res.chats.count, data.length, 'Incorrect count returned');

  prismaStub.workspace_chats.createMany = async () => {
    throw new Error('bad');
  };
  const errRes = await WorkspaceChats.bulkCreate(data);
  assert.strictEqual(errRes.chats, null, 'Chats should be null on error');
  assert.strictEqual(errRes.message, 'bad', 'Error message mismatch');
  console.log('Test passed');

const assert = require('assert');
const prisma = require('../utils/prisma');
const { WorkspaceChats } = require('../models/workspaceChats');

(async () => {
  await prisma.workspace_chats.deleteMany({});

  const validData = [
    { workspaceId: 1, prompt: 'a', response: '{}', include: true },
    { workspaceId: 1, prompt: 'b', response: '{}', include: true },
  ];
  const { count, message } = await WorkspaceChats.bulkCreate(validData);
  assert.strictEqual(message, null, 'Error returned on valid insert');
  assert.strictEqual(count, validData.length, 'Incorrect number of records created');

  const total = await prisma.workspace_chats.count();
  assert.strictEqual(total, validData.length, 'Records not inserted');

  const badData = [{ prompt: 'c', response: '{}' }];
  const badRes = await WorkspaceChats.bulkCreate(badData);
  assert.ok(badRes.message, 'Error message expected for invalid insert');
  assert.strictEqual(badRes.count, null, 'Count should be null on failure');

  console.log('Test passed');
  process.exit(0);

})();
