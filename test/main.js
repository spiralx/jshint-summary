
var gutil = require('gulp-util');
var should = require('should');

var jshint = require('gulp-jshint');
var summary = require('../');


describe('gulp-jshint-summary', function() {
  describe('getReporter()', function(){
    it('should return a function', function(done) {
      var reporter = summary().reporter;

      reporter.should.be.type('function');
      reporter.options.should.be.type('object');
      reporter.options.verbose.should.be.false;

      done();
    });

    it('should allow options to override defaults', function(done) {
      var reporter = summary({
        verbose: true,
        errCodeCol: 'magenta,bold'
      }).reporter;

      reporter.options.verbose.should.be.true;
      reporter.options.errCodeCol.should.eql('magenta,bold');

      done();
    });

    it('file should pass through', function(done) {
      var reporter = summary(), a = 0;

      var fakeFile = new gutil.File({
        path: './test/fixture/file.js',
        cwd: './test/',
        base: './test/fixture/',
        contents: new Buffer('doe =')
      });

      var reportStream = jshint.reporter(reporter);

      reportStream.on('data', function(newFile) {
        should.exist(newFile);
        should.exist(newFile.path);
        should.exist(newFile.relative);
        should.exist(newFile.contents);
        newFile.path.should.equal('./test/fixture/file.js');
        newFile.relative.should.equal('file.js');
        ++a;
      });

      reportStream.once('end', function () {
        a.should.equal(1);
        done();
      });

      reportStream.write(fakeFile);
      reportStream.end();
    });
  });
});
