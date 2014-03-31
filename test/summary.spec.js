
var gutil = require('gulp-util');
var expect = require('chai').expect;
var jshint = require('gulp-jshint');

var summary = require('../');


describe('gulp-jshint-summary', function() {
  describe('getReporter()', function(){
    it('should return a function', function(done) {
      var reporter = summary().reporter;

      expect(reporter).to.be.an('function');
      expect(reporter.options).to.be.an('object');
      expect(reporter.options.statistics).to.be.false;

      done();
    });

    it('should allow options to override defaults', function(done) {
      var reporter = summary({
        statistics: true,
        errCodeCol: 'magenta,bold'
      }).reporter;

      expect(reporter.options.statistics).to.be.true;
      expect(reporter.options.errCodeCol).to.equal('magenta,bold');

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
        expect(newFile).to.exist;
        expect(newFile.path).to.exist;
        expect(newFile.relative).to.exist;
        expect(newFile.contents).to.exist;

        expect(newFile.path).to.equal('./test/fixture/file.js');
        expect(newFile.relative).to.equal('file.js');
        ++a;
      });

      reportStream.once('end', function () {
        expect(a).to.equal(1);
        done();
      });

      reportStream.write(fakeFile);
      reportStream.end();
    });
  });
});
