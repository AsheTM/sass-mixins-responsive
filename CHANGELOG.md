
# 2.0.0

See [Migrating from 1.x](README.md#migrating-from-1x).

- [x] **Breaking:** no media type by default (``@media (...)`` instead of ``all and`` / ``screen and``); every mixin accepts an optional ``$device``
- [x] **Breaking:** breakpoints are validated (``px`` / ``em`` / ``rem`` numbers, same unit, ascending order)
- [x] **Breaking:** requires Dart Sass ``>=1.23.0``, LibSass / ``node-sass`` no longer supported
- [x] Support ``em`` and ``rem`` breakpoints
- [x] Add opt-in ``$media-range-syntax`` (``(612px < width <= 912px)``)
- [x] ``$breakpoint-laptop`` defaults to ``null`` (``false`` still works)
- [x] Document every setting and mixin; README rewritten around ``@use``

# 1.0.4

- [x] Add ``LICENSE`` file (ISC)
- [x] Add ``files`` list in package.json so only the library is published
- [x] Add ``sass >=1.23.0`` as an optional peer dependency
- [x] Add ``.editorconfig`` and use consistent indentation
- [x] Add compile tests, browser tests and CI

# 1.0.3

- [x] Fix internal comments leaking into compiled CSS
- [x] Fix ``for-huge-screen`` overlapping ``for-laptop`` at ``$breakpoint-laptop``
- [x] Fix fractional viewport widths matching no named breakpoint (ranges now start ``0.02px`` after the previous breakpoint instead of ``1px``)
- [x] Fix ``main`` entry in package.json and add ``sass`` / ``style`` fields
- [x] Fix README examples and typos

# 1.0.2

- [x] Update README.md

# 1.0.1

- [x] Update README.md

# 1.0.0

- [x] Made breakpoints customizable
- [x] Implement mixin ``for-mobile``
- [x] Implement mixin ``for-tablet``
- [x] Implement mixin ``for-laptop``
- [x] Implement mixin ``for-huge-screen``
- [x] Implement mixin ``at-least``
- [x] Implement mixin ``between``
- [x] Implement mixin ``at-most``
