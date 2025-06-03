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
})();
