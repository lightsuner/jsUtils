module.exports = function(grunt) {

  var dest = "dist/<%= pkg.name %>.js",
    destMin = "dist/<%= pkg.name %>.min.js",
    srcHintOptions = grunt.file.readJSON("src/.jshintrc")
    ;

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON("package.json"),
    uglify: {
      options: {
        banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */\n"
      },
      build: {
        src: dest,
        dest: destMin
      }
    },
    jsonlint: {
      pkg: {
        src: [ "package.json" ]
      }
    },
    jshint: {
      all: {
        src: [
          "src/**/*.js", "Gruntfile.js", "test/**/*.js"//, "build/tasks/*"
        ],
        options: {
          jshintrc: ".jshintrc"
        }
      },
      dist: {
        src: dest,
        options: srcHintOptions
      }
    },
    build: {
      all: {
        dest: dest,
        minimum: [
          "core"
        ]
      }
    }
  });

  // Load grunt tasks from NPM packages
  require( "load-grunt-tasks" )( grunt );

  // Load the plugin that provides the "uglify" task.
  grunt.loadNpmTasks("grunt-contrib-uglify");


  // Integrate jQuery specific tasks
  grunt.loadTasks("build/tasks");
  // Default task(s).
  //grunt.registerTask('default', ['build']);

};