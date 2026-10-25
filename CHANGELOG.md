
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
