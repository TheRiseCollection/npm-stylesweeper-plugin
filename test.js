const assert = require('assert');
const fs = require('fs').promises;
const path = require('path');

const TEST_DIR = path.join(__dirname, 'tmp-test');
const TEST_FILE_WITH_INLINE = path.join(TEST_DIR, 'inline.html');
const TEST_FILE_WITHOUT_INLINE = path.join(TEST_DIR, 'no-inline.html');

async function setup() {
  await fs.mkdir(TEST_DIR, { recursive: true });

  const htmlWithInline = `
    <html>
      <body>
        <div style="color: red; background: blue;">Test</div>
      </body>
    </html>
  `;

  const htmlWithoutInline = `
    <html>
      <body>
        <div class="no-inline">Test</div>
      </body>
    </html>
  `;

  await fs.writeFile(TEST_FILE_WITH_INLINE, htmlWithInline, 'utf8');
  await fs.writeFile(TEST_FILE_WITHOUT_INLINE, htmlWithoutInline, 'utf8');
}

async function run() {
  await setup();

  const { INLINE_STYLE_REGEX } = require('./index');
  const contentWithInline = await fs.readFile(TEST_FILE_WITH_INLINE, 'utf8');
  const contentWithoutInline = await fs.readFile(TEST_FILE_WITHOUT_INLINE, 'utf8');

  assert.ok(
    INLINE_STYLE_REGEX.test(contentWithInline),
    'Expected INLINE_STYLE_REGEX to match inline styles'
  );

  INLINE_STYLE_REGEX.lastIndex = 0;

  assert.ok(
    !INLINE_STYLE_REGEX.test(contentWithoutInline),
    'Expected INLINE_STYLE_REGEX not to match when there are no inline styles'
  );

  console.log('All tests passed');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

