'use strict';

var gulp   = require('gulp');
var jshint = require('gulp-jshint');
var mocha  = require('gulp-mocha');
var bump = require('gulp-bump');

var summary   = require('./');


gulp.task('bump', function(){
  gulp.src('./package.json')
  .pipe(bump({ type: 'minor' }))
  .pipe(gulp.dest('./'));
});

gulp.task('bumpfix', function(){
  gulp.src('./package.json')
  .pipe(bump({ type: 'patch' }))
  .pipe(gulp.dest('./'));
});


gulp.task('lint', function () {
  return gulp.src('./lib/*.js')
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter(summary({
      verbose: true,
      codeCol: 'magenta,bold',
      reasonCol: 'cyan,bold',
      unicode: true
    })));
});


gulp.task('mocha', function () {
  return gulp.src('./test/**/*.js')
    .pipe(mocha({
      reporter: 'list'
    }));
});


gulp.task('default', ['lint', 'mocha']);

