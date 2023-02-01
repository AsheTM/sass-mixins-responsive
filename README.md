
# Some responsive utilities Sass mixins for your needs

Take what you need!

## Install

You can install it with npm:

```bash
npm install @ashetm/sass-mixins-responsive
```

## Import

You only need to import ``@ashetm/sass-mixins-responsive``.

```scss
@import '@ashetm/sass-mixins-responsive';
```

or, if you want to override the breakpoint value(s)

```scss
@use '@ashetm/sass-mixins-responsive' as *;

$breakpoint-mobile: 500px;
$breakpoint-tablet: 800px;
$breakpoint-laptop: 1000px;
```

## Usage

### Variables

There is 3 variables that can be overriden: 

* ``$breakpoint-mobile`` with default value ``612px``
* ``$breakpoint-tablet`` with default value ``912px``
* ``$breakpoint-laptop`` with no default value

### Mixins

#### for-mobile

Example: 

```scss
.selector {
  @include for-mobile {
    width: 100%;
  }
}
```

gives in output: 

```css
@media all and (min-width: <$breakpoint-mobile: 612px>) {
  width: 100%;
}
```

#### for-tablet

Example: 

```scss
.selector {
  @include for-tablet {
    width: 100%;
  }
}
```

gives in output: 

```css
@media all and (min-width: <$breakpoint-mobile + 1: 613px>) and (max-width: <$breakpoint-tablet: 912px>) {
  width: 100%;
}
```

#### for-laptop

Example: 

```scss
.selector {
  @include for-laptop {
    width: 100%;
  }
}
```

gives in output: 

```css
/* If ``$breakpoint-laptop`` is given */
@media all and (min-width: <$breakpoint-tablet + 1: 913px>) and (max-width: <$breakpoint-laptop: 912px>) {
  width: 100%;
}

/* If ``$breakpoint-laptop`` is not given */
@media all and (min-width: <$breakpoint-tablet + 1: 913px>) {
  width: 100%;
}
```

#### for-huge-screen

**NB:** If ``$breakpoint-laptop`` is given, this mixin will be available otherwise it will throw an error.

Example: 

```scss
.selector {
  @include for-huge-screen {
    width: 100%;
  }
}
```

gives in output: 

```css
/* If ``$breakpoint-laptop`` is given */
@media all and (min-width: <$breakpoint-laptop + 1>) {
  width: 100%;
}
```

#### at-least

Example: 

```scss
.selector {
  @include at-least(<$value>, <$device: screen>) {
    width: 100%;
  }
}
```

gives in output: 

```css
@media <$device: screen> and (min-width: <$value>) {
  width: 100%;
}
```


#### between

Example: 

```scss
.selector {
  @include between(<$min>, <$max>, <$device: screen>) {
    width: 100%;
  }
}
```

gives in output: 

```css
@media <$device: screen> and (min-width: <$min>) and (max-width: <$max>) {
  width: 100%;
}
```

#### at-most

Example: 

```scss
.selector {
  @include at-most(<$value>, <$device: screen>) {
    width: 100%;
  }
}
```

gives in output: 

```css
@media <$device: screen> and (max-width: <$value>) {
  width: 100%;
}
```
