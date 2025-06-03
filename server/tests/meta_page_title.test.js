const path = require('path');
const assert = require('assert');

// stub SystemSettings before requiring MetaGenerator
const stubPath = path.join(__dirname, '../models/systemSettings.js');
require.cache[require.resolve(stubPath)] = {
  id: stubPath,
  filename: stubPath,
  loaded: true,
  exports: {
    SystemSettings: {
      async getValueOrFallback({ label }, fallback) {
        if (label === 'meta_page_title') return '<script>alert("x")</script>';
        if (label === 'meta_page_favicon') return null;
        return fallback;
      },
    },
  },
};

const { MetaGenerator } = require('../utils/boot/MetaGenerator');
const { escapeHtml } = require('../utils/helpers/escapeHtml');

(async () => {
  const gen = new MetaGenerator();
  const res = {
    status() { return this; },
    send(html) { this.html = html; return this; },
  };
  await gen.generate(res);
  const expected = escapeHtml('<script>alert("x")</script>');
  assert(res.html.includes(expected), 'Title was not escaped');
  console.log('Test passed');
})();
