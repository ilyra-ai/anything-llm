const path = require('path');
const assert = require('assert');
const { escapeHtml } = require('../utils/helpers/escapeHtml');

// stub prisma before requiring SystemSettings
const prismaPath = path.join(__dirname, '../utils/prisma/index.js');
require.cache[require.resolve(prismaPath)] = {
  id: prismaPath,
  filename: prismaPath,
  loaded: true,
  exports: {},
};

const { SystemSettings } = require('../models/systemSettings');

const malicious = '<script>alert("x")</script>';
const sanitized = SystemSettings.validations.meta_page_title(malicious);
assert.strictEqual(sanitized, escapeHtml(malicious), 'Validation failed to sanitize');

// stub SystemSettings before requiring MetaGenerator
const stubPath = path.join(__dirname, '../models/systemSettings.js');
require.cache[require.resolve(stubPath)] = {
  id: stubPath,
  filename: stubPath,
  loaded: true,
  exports: {
    SystemSettings: {
      async getValueOrFallback({ label }, fallback) {
        if (label === 'meta_page_title') return sanitized;
        if (label === 'meta_page_favicon') return null;
        return fallback;
      },
    },
  },
};

const { MetaGenerator } = require('../utils/boot/MetaGenerator');

(async () => {
  const gen = new MetaGenerator();
  const res = {
    status() { return this; },
    send(html) { this.html = html; return this; },
  };
  await gen.generate(res);
  assert(res.html.includes(sanitized), 'Title was not escaped');
  console.log('Test passed');
})();
