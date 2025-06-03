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
