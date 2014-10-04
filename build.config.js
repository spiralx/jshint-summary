
var args   = require('yargs').argv;

module.exports = {

  // Source file locations.

  src: 'lib/**/*.js',

  test: 'test/**/*.spec.{js,coffee}',

  fixtures: [
    'test/fixtures/clean.js',
    'test/fixtures/sloppy.js'
  ],


  // Plugin configuration.

  jshint: {
    reporter: {
      statistics: true,
      fileCol: 'yellow,bold'
    }
  },

  mocha: {
    useColors: !!args.color,
    reporter: 'spec'
  },

  istanbul: {
    dir: 'test/coverage'
  }

};
