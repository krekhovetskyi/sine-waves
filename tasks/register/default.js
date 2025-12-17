/**
 * CMD: grunt
 *
 * ---------------------------------------------------------------
 *
 * The default command starts a flow watch server and then runs any tasks
 * when the main js file changes or any test specs change
 *
 * Note: For test watching, use `npm run test:watch` instead
 *
 */
module.exports = function(grunt) {
  grunt.registerTask('default', [
    'flow:watch:start',
    'watch'
  ]);
};
