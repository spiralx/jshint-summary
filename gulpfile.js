'use strict';

var gulp   = require('gulp');
var $ = require('gulp-load-plugins')();

require('coffee-script/register');


// ----------------------------------------------------------------------------

var config = require('./build.config');

var log = function(s) {
  $.util.log($.util.colors.red.bold(s));
};


// ----------------------------------------------------------------------------

// e.g. gulp bump --type minor
gulp.task('bump', function() {
  var bumpType = require('yargs').argv.type || 'patch';

  gulp.src('./package.json')
    .pipe($.bump({ type: bumpType }))
    .pipe(gulp.dest('./'));
});


// ----------------------------------------------------------------------------
// Clean old directories

gulp.task('clean', function() {
  return gulp.src(config.istanbul.dir, { read: false })
    .pipe($.clean());
});


// ----------------------------------------------------------------------------
// Lints the files in test/fixtures/ using this as the reporter

gulp.task('demo', function() {
  return gulp.src(config.fixtures)
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('./', config.jshint.reporter));
});


// ----------------------------------------------------------------------------
// Lint using JSHint

gulp.task('lint', function() {
  return gulp.src(config.src)
    .pipe($.jshint('.jshintrc'))
    .pipe($.jshint.reporter('./', config.jshint.reporter));
});


// ----------------------------------------------------------------------------
// Run unit tests

gulp.task('mocha', function() {
  return gulp.src(config.test, { read: false })
    .pipe($.mocha(config.mocha))
    .on('error', log);
});


// ----------------------------------------------------------------------------
// Run instrumented unit tests and generate coverage reports

gulp.task('cover', function(cb) {
  gulp.src(config.src)
    .pipe($.istanbul())
    .on('finish', function() {
      gulp.src(config.test)
        .pipe($.mocha())
        .pipe($.istanbul.writeReports(config.istanbul))
        .on('end', cb);
    });
});


// ----------------------------------------------------------------------------

gulp.task('test', ['lint', 'mocha']);

gulp.task('watch', ['test'], function() {
  gulp.watch([ config.src, config.test ], ['test']);
});

gulp.task('default', ['watch']);
