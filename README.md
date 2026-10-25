
# @ashetm/sass-mixins-responsive

Some responsive utilities Sass mixins for your needs. Take what you need!

- Named ranges: ``for-mobile``, ``for-tablet``, ``for-laptop``, ``for-huge-screen``
- Generic queries: ``at-least``, ``between``, ``at-most``
- Breakpoints in ``px``, ``em`` or ``rem``, no gap between ranges, optional media query range syntax

## Install

```bash
npm install @ashetm/sass-mixins-responsive
```

Requires [Dart Sass](https://sass-lang.com/dart-sass) ``>=1.23.0`` (``sass`` or ``sass-embedded``). LibSass / ``node-sass`` is not supported.

## Usage

Load the module with a namespace, so its names cannot clash with yours:

```scss
@use '@ashetm/sass-mixins-responsive' as responsive;

.selector {
  @include responsive.for-mobile {
    width: 100%;
  }
}
```

```css
@media (max-width: 612px) {
  .selector {
    width: 100%;
  }
}
```

### Configuration

Override the settings with ``with (...)``:

```scss
@use '@ashetm/sass-mixins-responsive' as responsive with (
  $breakpoint-mobile: 500px,
  $breakpoint-tablet: 800px,
  $breakpoint-laptop: 1200px
);
```

| Setting | Default | Description |
|---|---|---|
| ``$breakpoint-mobile`` | ``612px`` | Last width of the mobile range |
| ``$breakpoint-tablet`` | ``912px`` | Last width of the tablet range |
| ``$breakpoint-laptop`` | ``null`` | Last width of the laptop range. ``null`` (or ``false``): laptop is the last range and ``for-huge-screen`` is not available |
| ``$media-range-syntax`` | ``false`` | Output ``(612px < width <= 912px)`` instead of ``min-width`` / ``max-width``, see [Range syntax](#range-syntax) |

### Without namespace

```scss
@use '@ashetm/sass-mixins-responsive' as *;

.selector {
  @include for-mobile {
    width: 100%;
  }
}
```

### Legacy ``@import``

Still supported, but ``@import`` is deprecated by Sass and will be removed in Dart Sass 3.0. Set the variables **before** the import:

```scss
$breakpoint-mobile: 500px;
@import '@ashetm/sass-mixins-responsive';
```

## Mixins

The examples below use the default settings with ``$breakpoint-laptop: 1200px``.

### Named ranges

Each breakpoint is the last width (included) of its range. The next range starts right after it: ``0.02px`` later (``0.00125em`` / ``0.00125rem``), so whole-pixel widths stay in the same range while fractional widths (browser zoom, display scaling at 125% / 150%) always match exactly one range.

| Mixin | Output |
|---|---|
| ``for-mobile`` | ``@media (max-width: 612px)`` |
| ``for-tablet`` | ``@media (min-width: 612.02px) and (max-width: 912px)`` |
| ``for-laptop`` | ``@media (min-width: 912.02px) and (max-width: 1200px)`` |
| ``for-laptop`` without ``$breakpoint-laptop`` | ``@media (min-width: 912.02px)`` |
| ``for-huge-screen`` | ``@media (min-width: 1200.02px)`` (error without ``$breakpoint-laptop``) |

```scss
.selector {
  @include responsive.for-tablet {
    width: 50%;
  }
}
```

### Generic queries

| Mixin | Output |
|---|---|
| ``at-least($min)`` | ``@media (min-width: $min)`` |
| ``between($min, $max)`` | ``@media (min-width: $min) and (max-width: $max)`` |
| ``at-most($max)`` | ``@media (max-width: $max)`` |

```scss
.selector {
  @include responsive.between(400px, 800px) {
    width: 50%;
  }
}
```

### Media type

Every mixin takes an optional last argument ``$device``: a media type such as ``screen`` or ``print``. Without it, the query applies to all media types.

```scss
@include responsive.for-mobile(screen) { ... }
// @media screen and (max-width: 612px)

@include responsive.at-least(400px, print) { ... }
// @media print and (min-width: 400px)
```

## Units

Breakpoints can be in ``px``, ``em`` or ``rem``, as long as all of them use the same unit:

```scss
@use '@ashetm/sass-mixins-responsive' as responsive with (
  $breakpoint-mobile: 38.25em,
  $breakpoint-tablet: 57em,
  $breakpoint-laptop: 75em
);

// for-tablet: @media (min-width: 38.25125em) and (max-width: 57em)
```

Invalid breakpoints fail at compile time with a clear message:

```
'$breakpoint-mobile' must be a number in px, em or rem, got '600'.
'$breakpoint-tablet' (60em) must use the same unit as '$breakpoint-mobile' (612px).
'$breakpoint-tablet' (600px) must be greater than '$breakpoint-mobile' (612px).
```

## Range syntax

With ``$media-range-syntax: true``, every mixin outputs [Media Queries Level 4 range syntax](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_media_queries/Using_media_queries#syntax_improvements_in_level_4). Ranges use exclusive bounds instead of the ``0.02px`` step.

| Mixin | Output |
|---|---|
| ``for-mobile`` | ``@media (width <= 612px)`` |
| ``for-tablet`` | ``@media (612px < width <= 912px)`` |
| ``for-laptop`` | ``@media (912px < width <= 1200px)`` |
| ``for-huge-screen`` | ``@media (width > 1200px)`` |
| ``at-least($min)`` | ``@media (width >= $min)`` |
| ``between($min, $max)`` | ``@media ($min <= width <= $max)`` |
| ``at-most($max)`` | ``@media (width <= $max)`` |

Range syntax needs Chrome 104+, Firefox 63+ and Safari 16.4+, so it is off by default.

## Migrating from 1.x

- **Media type.** 1.x output ``@media all and (...)`` for named mixins and ``@media screen and (...)`` for ``at-least`` / ``between`` / ``at-most``. 2.0 outputs no media type (same as ``all``). To keep ``screen``, pass it: ``at-least(400px, screen)``.
- **Dart Sass ``>=1.23.0`` only.** The module now uses Sass built-in modules, so LibSass / ``node-sass`` is no longer supported.
- **Breakpoint validation.** Breakpoints that are not ``px`` / ``em`` / ``rem`` numbers, mix units or are not in ascending order now fail at compile time instead of producing broken CSS.
- **``$breakpoint-laptop``** defaults to ``null``. ``false`` still works.
- **Loading.** Prefer ``@use ... as responsive`` (or ``as *``). ``@import`` still works.

## License

[ISC](LICENSE)
