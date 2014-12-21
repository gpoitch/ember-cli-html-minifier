# ember-cli-html-minifier

Uses [html-minifier](https://github.com/kangax/html-minifier) to minify your ember-cli app's html as well as any inline js/css.

## Installation
```
npm install ember-cli-html-minifier --save-dev
```

By default, html minification will automatically happen on **production** builds.  
You can also manually control if it is enabled, and tune the minfier options to your liking:

```js
// Brocfile.js

var app = new EmberApp({
  minifyHTML: {
    enabled: true,
    minifierOptions: { ... }
  }
});
```

## Minifier Options
See: https://github.com/kangax/html-minifier#options-quick-reference
By default, the **html-minifier** module has all options turned off, so **ember-cli-html-minifier** sets some sensible options:

```js
{
  collapseWhitespace : true,
  removeComments     : true,
  minifyJS           : true,
  minifyCSS          : true
}
```
