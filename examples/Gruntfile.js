
module.exports = function(grunt) {

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({

    // Lints all .js files under src/ using jshint-summary as the reporter
    jshint: {
      options: {
        reporter: require('../'),
        jshintrc: '.jshintrc',
        statistics: true,
        fileCol: 'yellow,bold'
      },
      target: [
        'test/fixtures/*.js'
      ]
    }

  });

  grunt.registerTask('default', ['jshint']);

};
