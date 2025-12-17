/**
 * CMD: grunt test
 *
 * ---------------------------------------------------------------
 *
 * Runs unit tests and `grunt hint`
 *
 */
module.exports = function(grunt) {
  // Register a task to run vitest
  grunt.registerTask('vitest', function() {
    var done = this.async();
    var exec = require('child_process').exec;
    
    exec('npm test', function(error, stdout, stderr) {
      if (stdout) {
        grunt.log.write(stdout);
      }
      if (stderr) {
        grunt.log.write(stderr);
      }
      if (error) {
        grunt.fail.warn('Tests failed');
      }
      done(!error);
    });
  });

  grunt.registerTask('test', [
    'vitest',
    'hint'
  ]);
};
