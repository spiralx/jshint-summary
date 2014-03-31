'use strict';

var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var mocha  = require('gulp-mocha');
var bump = require('gulp-bump');

var summary   = require('./');


// e.g. gulp bump --type minor
gulp.task('bump', function(){
  return gulp.src('./package.json')
  .pipe(bump({ type: gulp.env.type || 'patch' }))
  .pipe(gulp.dest('./'));
});


gulp.task('lint', function () {
  return gulp.src('./lib/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(summary({
      statistics: false,
      unicode: true
    })));
});


gulp.task('mocha', function () {
  return gulp.src('./test/**/*.js')
    .pipe(mocha({
      reporter: 'html-cov'
    }));
});

gulp.task('test', ['lint', 'mocha']);


gulp.task('watch', ['test'], function() {
  gulp.watch(['./lib/*.js', './test/*.js'], ['test']);
});


gulp.task('default', ['watch']);

