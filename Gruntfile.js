/*global module:false*/

var _ = require('lodash');

module.exports = function (grunt) {

    //require('./tasks/testbuilder')(grunt);

    require('load-grunt-tasks')(grunt);
    require('time-grunt')(grunt);

    var pkg = grunt.file.readJSON('package.json');

    var config = grunt.file.readYAML('_config.yml');

    var defaults = config.builds[config.default];

    // Project configuration.
    grunt.initConfig({
        config: config,
        radicjs: {
            filename: defaults.filename
        },
        // The actual grunt server settings
        // The actual grunt server settings
        connect: {
            options: {
                port: 9009,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: 'test'
                },
                dist: {
                    options: {
                        open: true,
                        base: 'test'
                    }
                }
            }
        },
        wiredep: {
            task: {
                src: [
                    'test/index.html'
                ]
            }
        },
        build: {
            all: {
                src: 'src/',

                dest: "dist/<%= radicjs.filename %>.js",
                minimum: [
                    "core",
                    "base"
                ],
                // Exclude specified modules if the module matching the key is removed
                removeWith: {
                    a: ["v/a", "b"]
                }
            }
        },
        copy: {
            test: {
                src: 'dist/radic.js',
                dest: 'test/radic.js'
            },
            packer: {
                src: 'src/tpl/_pack.js',
                dest: 'dist/_pack.js'
            }
        },
        clean: {
            tmp: ['.tmp'],
            dist: ['dist'],
            lodash: ['src/tpl/_lodash.js', 'src/tpl/_lodash.min.js'],
            packer: ['src/tpl/_pack.js', 'dist/_pack.js']
        },
        preprocess: {
            options: {
                context: {
                    DEBUG: true
                }
            },
            html: {
                src: 'test/pages/index.html',
                dest: 'dist/index.html'
            },
            lodash: {
                src: 'src/tpl/lodash.js',
                dest: 'src/core/getlodash.js'
            },
            packer: {
                options: {
                    context: '<%= radicjs.packer %>'
                },
                src: 'dist/_pack.js',
                dest: 'dist/packed/<%= radicjs.filename %>.packed.js'
            }
        },
        'string-replace': {
            lodash: {
                files: {
                    'src/core/getlodash.js': 'src/core/getlodash.js'
                },
                options: {
                    replacements: [
                        // place files inline example
                        {
                            pattern: /;\(function\(\)(?:\s+|)\{/,
                            replacement: ''
                        },
                        {
                            pattern: /}\.call\(this\)\);/,
                            replacement: ''
                        }
                    ]
                }
            },
            packer: {
                files: {
                    'src/tpl/_pack.js': 'src/tpl/pack.js'
                },
                options: {
                    replacements: [
                        // place files inline example
                        {
                            pattern: /_FILENAME_/,
                            replacement: '<%= radicjs.filename %>.js'
                        }
                    ]
                }

            }
        },
        uglify: {
            options: {
                report: 'gzip'
            },
            dist: {
                files: {
                    'dist/radic.min.js': ['dist/radic.js']
                }
            },
            radicjs: {
                files: {
                    'dist/<%= radicjs.filename %>.min.js': ['dist/<%= radicjs.filename %>.js']
                }
            },
            packer: {
                files: {
                    'dist/packed/<%= radicjs.filename %>.packed.min.js': ['dist/packed/<%= radicjs.filename %>.packed.js']
                }
            }
        },
        shell: {
            lodash: {
                command: 'lodash underscore include=<%= radicjs.lodash %> exports=none -o src/tpl/_lodash.js'
            },
            test: {
                command: 'nodeunit test/*.js'
            },
            radicjs: {
                command: '<%= radicjs.buildCommand %>' //
            }
        },
        watch: {
            options: {
                liverreload: true
            },
            js: {
                files: ['src/**'],
                tasks: ['build', 'copy:test', 'uglify'],
                options: {
                    liverreload: true
                }
            },

            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'src/**/*'
                ]
            }
        }
    });

    grunt.loadTasks("tasks");



    grunt.registerTask('dist', [ 'build', 'uglify', 'copy:test' ]);

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }
        grunt.task.run([
            'dist',
            'connect:livereload',
            'watch'
        ]);
    });

};
