import assert from 'node:assert/strict';
import { describe, test } from 'node:test';

import { compile, compileRaw, mediaQueries } from './helpers.mjs';

const ALL_NAMED = `
  .a { @include for-mobile { color: red; } }
  .b { @include for-tablet { color: red; } }
  .c { @include for-laptop { color: red; } }
`;

describe('named breakpoints', () => {
  test('default breakpoints', () => {
    assert.deepEqual(mediaQueries(compile(ALL_NAMED)), [
      '(max-width: 612px)',
      '(min-width: 612.02px) and (max-width: 912px)',
      '(min-width: 912.02px)',
    ]);
  });

  test('custom breakpoints with @use ... with', () => {
    const css = compile(ALL_NAMED + '.d { @include for-huge-screen { color: red; } }', {
      'breakpoint-mobile': '500px',
      'breakpoint-tablet': '800px',
      'breakpoint-laptop': '1200px',
    });

    assert.deepEqual(mediaQueries(css), [
      '(max-width: 500px)',
      '(min-width: 500.02px) and (max-width: 800px)',
      '(min-width: 800.02px) and (max-width: 1200px)',
      '(min-width: 1200.02px)',
    ]);
  });

  test('for-huge-screen fails when $breakpoint-laptop is not set', () => {
    assert.throws(
      () => compile('.d { @include for-huge-screen { color: red; } }'),
      /'\$breakpoint-laptop' not initialized yet!/,
    );
  });

  test('custom media type', () => {
    const css = compile(`
      .a { @include for-mobile(screen) { color: red; } }
      .b { @include for-tablet(screen) { color: red; } }
      .c { @include for-laptop(screen) { color: red; } }
      .d { @include for-huge-screen(print) { color: red; } }
    `, { 'breakpoint-laptop': '1200px' });

    assert.deepEqual(mediaQueries(css), [
      'screen and (max-width: 612px)',
      'screen and (min-width: 612.02px) and (max-width: 912px)',
      'screen and (min-width: 912.02px) and (max-width: 1200px)',
      'print and (min-width: 1200.02px)',
    ]);
  });

  test('content is wrapped in the media query', () => {
    const css = compile('.a { @include for-mobile { color: red; } }');

    assert.match(css, /@media \(max-width: 612px\) \{\s*\.a \{\s*color: red;\s*\}\s*\}/);
  });

  test('no comments are emitted', () => {
    const css = compile(ALL_NAMED + '.d { @include for-huge-screen { color: red; } }', {
      'breakpoint-laptop': '1200px',
    });

    assert.doesNotMatch(css, /\/\*/);
  });
});

describe('generic mixins', () => {
  test('no media type by default', () => {
    const css = compile(`
      .a { @include at-least(400px) { color: red; } }
      .b { @include between(400px, 800px) { color: red; } }
      .c { @include at-most(800px) { color: red; } }
    `);

    assert.deepEqual(mediaQueries(css), [
      '(min-width: 400px)',
      '(min-width: 400px) and (max-width: 800px)',
      '(max-width: 800px)',
    ]);
  });

  test('custom media type', () => {
    const css = compile(`
      .a { @include at-least(400px, print) { color: red; } }
      .b { @include between(400px, 800px, screen) { color: red; } }
      .c { @include at-most(800px, print) { color: red; } }
    `);

    assert.deepEqual(mediaQueries(css), [
      'print and (min-width: 400px)',
      'screen and (min-width: 400px) and (max-width: 800px)',
      'print and (max-width: 800px)',
    ]);
  });
});

describe('legacy @import', () => {
  test('variables set before @import override the defaults', () => {
    const css = compileRaw(`
      $breakpoint-mobile: 500px;
      @import "index";
      .a { @include for-mobile { color: red; } }
      .b { @include for-tablet { color: red; } }
    `);

    assert.deepEqual(mediaQueries(css), [
      '(max-width: 500px)',
      '(min-width: 500.02px) and (max-width: 912px)',
    ]);
  });
});
