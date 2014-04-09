'use strict';

var gulp   = require('gulp');
var plugins = require('gulp-load-plugins')();

var args   = require('yargs').argv;
var summary   = require('./');


// e.g. gulp bump --type minor
gulp.task('bump', function() {
  var bumpType = args.t || args.type || 'patch';

  return gulp.src('./package.json')
  .pipe(plugins.bump({ type: bumpType }))
  .pipe(gulp.dest('./'));
});


// Lints the file test/fixtures/sloppy.js and uses this to report on it
gulp.task('demo', function () {
  return gulp.src('./test/fixtures/*.js')
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter(summary({
      statistics: true
    })));
});


gulp.task('lint', function () {
  return gulp.src('./lib/*.js')
    .pipe(plugins.jshint('.jshintrc'))
    .pipe(plugins.jshint.reporter(summary({
      statistics: false
    })));
});


gulp.task('mocha', function () {
  return gulp.src('./test/**/*.js')
    .pipe(plugins.mocha({
      useColors: !!args.color,
      reporter: 'spec'
    }));
});


gulp.task('test', ['lint', 'mocha']);


gulp.task('watch', ['test'], function() {
  gulp.watch(['./lib/*.js', './test/*.js'], ['test']);
});


gulp.task('default', ['test']);

