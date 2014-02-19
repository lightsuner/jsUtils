module.exports = function(grunt) {

    var pkgName = "<%= pkg.name %>",
        destPath = "dist/",
        dest = destPath+pkgName+".js",
        destMin = destPath+pkgName+".min.js",
        srcHintOptions = grunt.file.readJSON("src/.jshintrc")
        ;

    // The concatenated file won't pass onevar
    // But our modules can
    delete srcHintOptions.onevar;

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON("package.json"),
/*        uglify: {
            options: {
                banner: "*//*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> *//*\n"
            },
            build: {
                src: dest,
                dest: destMin
            }
        },*/
        build: {
            all: {
                dest: dest,
                minimum: [
                    "core"
                ]
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
                    "src/**/*.js",
                    "Gruntfile.js",
                    "test/**/*.js",
                    "build/tasks/*"
                ],
                options: {
                    jshintrc: true
                }
            },
            dist: {
                src: dest,
                options: srcHintOptions
            }
        },
        jscs: {
            src: "src/**/*.js",
            gruntfile: "Gruntfile.js",
            tasks: "build/tasks/*.js"
        },
        uglify: {
            build: {
                src: dest,
                dest: destMin
            },
            options: {
                preserveComments: false,
                sourceMap: destPath+pkgName+".min.map",
                sourceMappingURL: pkgName+".min.map",
                report: "min",
                beautify: {
                    ascii_only: true
                },
                banner: "/*! <%= pkg.name %> <%= grunt.template.today(\"yyyy-mm-dd\") %> */",
                compress: {
                    hoist_funs: false,
                    loops: false,
                    unused: false
                }
            }
        }
    });

    // Load grunt tasks from NPM packages
    require("load-grunt-tasks")(grunt);

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks("grunt-contrib-uglify");

    grunt.loadTasks("build/tasks");

    // Default task(s).
    grunt.registerTask("default", [
        "jsonlint",
        "build:*:*",
        "jshint",
        "jscs",
        "uglify"
    ]);

};
