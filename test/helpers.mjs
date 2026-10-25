import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

// Loaded through require: older sass releases have no named ESM exports.
const sass = createRequire(import.meta.url)('sass');

export const ROOT = fileURLToPath(new URL('..', import.meta.url));

/**
 * Compile `body` against the library loaded with `@use ... as *`.
 * `config` is the `with (...)` map, e.g. { 'breakpoint-laptop': '1200px' }.
 */
export function compile(body, config = {}) {
  const entries = Object.entries(config).map(([key, value]) => `$${key}: ${value}`);
  const withClause = entries.length ? ` with (${entries.join(', ')})` : '';

  return compileRaw(`@use "index" as *${withClause};\n${body}`);
}

/** Compile a full stylesheet that loads the library itself. */
export function compileRaw(source) {
  return sass.compileString(source, {
    loadPaths: [ROOT],
    style: 'expanded',
    // Silences deprecation warnings (e.g. legacy @import) in test output.
    logger: { warn() {} },
  }).css;
}

/** Media query preludes of the compiled CSS, in order. */
export function mediaQueries(css) {
  return [...css.matchAll(/@media ([^{]+?) \{/g)].map(([, query]) => query);
}
