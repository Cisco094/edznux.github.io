'use strict';

module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    // Task configuration.
    clean: {
      files: ['dist']
    },
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: ['src/js/main.js','src/js/canvas.js'],// 'src/js/project.js', 'src/js/outro.js'],
        dest: 'assets/js/main.js',
      },
    },
     less: {
         development: {
             files: {"assets/css/main.css": "src/css/main.less"}
         },
         production: {
             options: {
                 cleancss: true
             },
             files: {"assets/css/main.css": "src/css/main.less"}
         }
     },
    watch: {
      style: {
        files: ['**/*.less'],
        tasks: ['less'],
        options: {
          spawn: false,
        },
      },
      scripts: {
        files: ['src/js/*.js'],
        tasks: ['concat'],
        options: {
          spawn: false,
        },
      },
    },
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-less');
  // Default task.
  grunt.registerTask('default', ['clean', 'concat','less','watch']);

};
