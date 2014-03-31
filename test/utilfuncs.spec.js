
var expect = require('chai').expect;

var chalk = require('chalk');

var utils = require('../lib/utilfuncs');



describe('utilfuncs.js', function() {
  describe('mapToEachLine()', function() {
    var input = ' first line: \n\nsecond line\n  \nstuff...';

    var fn = function(t) {
      return t.replace(/\s+/g, '-');
    }

    it('should get rid of CR if no extra arguments', function(done) {
      var res = utils.mapToEachLine('foo\nbar\r\nbaz');

      expect(res).to.be.an('string');
      expect(res).to.equal('foo\nbar\nbaz');

      res = utils.mapToEachLine(input);

      expect(res).to.be.an('string');
      expect(res).to.have.string(input);

      done();
    });

    it('should call the function on each line', function(done) {
      var res = utils.mapToEachLine(input, fn);

      expect(res).to.be.an('string');
      expect(res).to.equal('-first-line:-\n\nsecond-line\n-\nstuff...');

      done();
    });

    it('should trim if no func is specified', function(done) {
      var res = utils.mapToEachLine(input, true);

      expect(res).to.be.an('string');
      expect(res).to.equal('first line:\n\nsecond line\n\nstuff...');

      done();
    });

    it('should trim, then call the function on each line', function(done) {
      var res = utils.mapToEachLine(input, fn, true);

      expect(res).to.be.an('string');
      expect(res).to.equal('first-line:\n\nsecond-line\n\nstuff...');

      done();
    });
  });


  describe('pluralise()', function() {
    it('should not pluralise when count = 1', function(done) {
      var res = utils.pluralise('word', 1);

      expect(res).to.be.an('string');
      expect(res).to.equal('word');

      done();
    });

    it('should pluralise when count != 1', function(done) {
      var res = utils.pluralise('word', 0);

      expect(res).to.be.an('string');
      expect(res).to.equal('words');

      res = utils.pluralise('word', 10);

      expect(res).to.be.an('string');
      expect(res).to.equal('words');

      done();
    });
  });


  describe('paintbrush()', function() {
    var input = 'foobar';

    it('should handle a blank colour', function(done) {
      expect(utils.paintbrush('')(input)).to.equal(input);
      done();
    });

    it('should handle an invalid colour', function(done) {
      expect(utils.paintbrush('puce')(input)).to.equal(input);
      done();
    });

    it('should handle a valid and invalid colour', function(done) {
      expect(utils.paintbrush('blue,large')(input)).to.equal(chalk.blue(input));
      done();
    });

    it('should handle a valid colour', function(done) {
      expect(utils.paintbrush('green')(input)).to.equal(chalk.green(input));
      expect(utils.paintbrush('magenta')(input)).to.equal(chalk.magenta(input));
      expect(utils.paintbrush('bold')(input)).to.equal(chalk.bold(input));
      done();
    });

    it('should handle valid colours', function(done) {
      expect(utils.paintbrush('green,bold')(input)).to.equal(chalk.green.bold(input));
      done();
    });
  });

  describe('paint()', function() {
    var input = 'foobar';

    it('should handle a blank colour', function(done) {
      expect(utils.paint('', input)).to.equal(input);
      done();
    });

    it('should handle an invalid colour', function(done) {
      expect(utils.paint('puce', input)).to.equal(input);
      done();
    });

    it('should handle a valid and invalid colour', function(done) {
      expect(utils.paint('blue,large', input)).to.equal(chalk.blue(input));
      done();
    });

    it('should handle a valid colour', function(done) {
      expect(utils.paint('green', input)).to.equal(chalk.green(input));
      expect(utils.paint('magenta', input)).to.equal(chalk.magenta(input));
      expect(utils.paint('bold', input)).to.equal(chalk.bold(input));
      done();
    });

    it('should handle valid colours', function(done) {
      expect(utils.paint('green,bold', input)).to.equal(chalk.green.bold(input));
      done();
    });
  });

});
