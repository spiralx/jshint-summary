# jshint-summary

A customisable reporter for [JSHint](https://github.com/jshint/jshint), based on the [Stylish](https://npmjs.org/package/jshint-stylish) reporter.

## Install

Install with [npm](https://npmjs.org/package/jshint-summary):

```
npm install --save-dev jshint-summary
```


## Getting started

This module exports a single function which can take a single options object, and returns

Use it with:

#### JSHint CLI

```
jshint --reporter node_modules/jshint-summary/index.js file.js
```

#### [gulp-jshint](https://github.com/wearefractal/gulp-jshint)

```js
var summary = require('jshint-summary');

gulp.task('default', function () {
  return gulp.src(['file.js'])
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(summary({
      verbose: true,
      reasonCol: 'cyan,bold'
    })));
});
```

#### [grunt-contrib-jshint](https://github.com/gruntjs/grunt-contrib-jshint)

```js
grunt.initConfig({
  jshint: {
    options: {
      reporter: require('jshint-summary')
    },
    target: ['file.js']
  }
});

grunt.loadNpmTasks('grunt-contrib-jshint');
grunt.registerTask('default', ['jshint']);
```

## Options


#### `verbose`

Default `false`, if `true` then show the JSHint error code for each issue.

#### `statistics`

Defaults to `false`. If `true` then after reporting all issues found, the reporter will display various statistics JSHint generates - currently unused and implied global variables in each file.

#### `unicode`

Defaults to `false` on Windows, `true` otherwise - you can override this if your console can display Unicode characters.

#### `fileCol`, `positionCol`, `reasonCol`, `codeCol`, `errorsCol`, `okCol`

Each of these represents the colour of part of the output - `fileCol` is the current file name, `positionCol`, `reasonCol` and `codeCol` are the colours of the columns for each issue, and `errorsCol` and `okCol` are the colours of the final summary line. You can set them to a string with any of the values 'white', 'grey', 'red', 'green', 'blue', 'yellow', 'cyan' or 'magenta', and optionally add 'bold' after a comma as well e.g.

```js
    ...
    fileCol: 'red,bold',
    reasonCol: 'green,bold',
    codeCol: 'white'
    ...
```

## License

BSD © [James Skinner](http://github.com/spiralx)
