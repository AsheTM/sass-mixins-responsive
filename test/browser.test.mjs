// Loads the compiled CSS in headless Chrome / Edge and checks which named
// breakpoint applies at whole and fractional viewport widths.
//
// Uses the browser from $CHROME_PATH, or the first one found on this machine.

import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { existsSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { after, describe, test } from 'node:test';
import { pathToFileURL } from 'node:url';

import { compile } from './helpers.mjs';

const BROWSER_CANDIDATES = {
  win32: [
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  ],
  darwin: [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge',
  ],
  linux: [
    '/usr/bin/google-chrome',
    '/usr/bin/google-chrome-stable',
    '/usr/bin/chromium',
    '/usr/bin/chromium-browser',
    '/usr/bin/microsoft-edge',
  ],
};

const RANGES = ['mobile', 'tablet', 'laptop', 'huge-screen'];

// Fractional widths around each boundary of 612px / 912px / 1200px.
const WIDTHS = [
  611, 612, 612.25, 612.5, 612.75, 612.99, 613,
  912, 912.5, 913,
  1200, 1200.5, 1201,
];

const DEVICE_SCALE_FACTORS = ['1', '1.25', '1.5'];

function findBrowser() {
  const candidates = [process.env.CHROME_PATH, ...(BROWSER_CANDIDATES[process.platform] ?? [])];

  return candidates.find((path) => path && existsSync(path));
}

/** Range expected at a whole-pixel width. */
function expectedRange(width) {
  if (width <= 612) return 'mobile';
  if (width <= 912) return 'tablet';
  if (width <= 1200) return 'laptop';
  return 'huge-screen';
}

function buildPage(css) {
  return `<!doctype html>
<html><body style="margin:0"><pre id="out"></pre><script>
const css = ${JSON.stringify(css)};
const ranges = ${JSON.stringify(RANGES)};
const rows = [];
for (const width of ${JSON.stringify(WIDTHS)}) {
  const frame = document.createElement('iframe');
  frame.style.cssText = 'border:0;display:block;height:10px;width:' + width + 'px';
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  doc.open();
  doc.write('<!doctype html><style>' + css + '</style>');
  doc.close();
  frame.offsetWidth;
  const style = frame.contentWindow.getComputedStyle(doc.documentElement);
  rows.push({ width, matched: ranges.filter((range) => style.getPropertyValue('--' + range).trim()) });
  frame.remove();
}
document.getElementById('out').textContent = JSON.stringify(rows);
</script></body></html>`;
}

const browser = findBrowser();
const workDir = mkdtempSync(join(tmpdir(), 'sass-mixins-responsive-'));

after(() => rmSync(workDir, { recursive: true, force: true }));

function runInBrowser(page, deviceScaleFactor) {
  const pagePath = join(workDir, 'page.html');
  writeFileSync(pagePath, page);

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    `--user-data-dir=${join(workDir, 'profile')}`,
    `--force-device-scale-factor=${deviceScaleFactor}`,
    '--window-size=1400,900',
    '--dump-dom',
    pathToFileURL(pagePath).href,
  ];
  // Chrome's sandbox is not available on GitHub-hosted Linux runners.
  if (process.platform === 'linux') args.unshift('--no-sandbox');

  const dom = execFileSync(browser, args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  const match = dom.match(/<pre id="out">(.*?)<\/pre>/s);
  assert.ok(match?.[1], 'browser did not produce results');

  return JSON.parse(match[1]);
}

// Each configuration describes the same 612px / 912px / 1200px breakpoints.
const CONFIGS = {
  px: { 'breakpoint-laptop': '1200px' },
  // At the default 16px font size.
  em: { 'breakpoint-mobile': '38.25em', 'breakpoint-tablet': '57em', 'breakpoint-laptop': '75em' },
  'range syntax': { 'breakpoint-laptop': '1200px', 'media-range-syntax': 'true' },
};

describe('named breakpoints in a real browser', { skip: browser ? false : 'no Chrome / Edge found (set CHROME_PATH)' }, () => {
  for (const [configName, config] of Object.entries(CONFIGS)) {
    const css = compile(
      RANGES.map((range) => `html { @include for-${range} { --${range}: 1; } }`).join('\n'),
      config,
    );
    const page = buildPage(css);

    for (const deviceScaleFactor of DEVICE_SCALE_FACTORS) {
      test(`${configName}: every width matches exactly one range (device scale factor ${deviceScaleFactor})`, () => {
        for (const { width, matched } of runInBrowser(page, deviceScaleFactor)) {
          assert.equal(matched.length, 1, `width ${width}px matched [${matched.join(', ')}]`);

          if (Number.isInteger(width)) {
            assert.deepEqual(matched, [expectedRange(width)], `width ${width}px`);
          }
        }
      });
    }
  }
});
