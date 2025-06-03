const path = require('path');
const fs = require('fs');
const assert = require('assert');
process.env.NODE_ENV = 'development';
const asTxt = require('../processSingleFile/convert/asTxt');

(async () => {
  const file = path.join(__dirname, 'fixtures', 'no_metadata.txt');
  const result = await asTxt({ fullFilePath: file, filename: 'no_metadata.txt' });
  const docLocation = path.join(__dirname, '../../server/storage/documents', result.documents[0].location);
  const data = JSON.parse(fs.readFileSync(docLocation, 'utf8'));
  assert.strictEqual(data.docAuthor, 'Unknown');
  assert.strictEqual(data.description, 'Unknown');
  fs.rmSync(docLocation);
  console.log('Fallback metadata test passed');
})();
