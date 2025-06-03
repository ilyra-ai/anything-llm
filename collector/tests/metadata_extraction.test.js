const path = require('path');
const fs = require('fs');
const assert = require('assert');
const asTxt = require('../processSingleFile/convert/asTxt');

(async () => {
  const file = path.join(__dirname, 'fixtures', 'frontmatter.txt');
  const result = await asTxt({ fullFilePath: file, filename: 'frontmatter.txt' });
  const docLocation = path.join(__dirname, '../../server/storage/documents', result.documents[0].location);
  const data = JSON.parse(fs.readFileSync(docLocation, 'utf8'));
  assert.strictEqual(data.docAuthor, 'Jane Doe');
  assert.strictEqual(data.description, 'Sample File');
  fs.rmSync(docLocation);
  console.log('Test passed');
})();
