
var _ = require('lodash');

var exec = require('child_process').exec;
module.exports = function(grunt) {
    'use strict';

    var config = grunt.file.readYAML(grunt.option('configfile') || '_config.yml');

    var defaults = config.builds[config.default];



    grunt.registerTask('packer', function() {
        grunt.log.ok('Creating dependency included packed version.');
        grunt.task.run(['string-replace:packer', 'copy:packer', 'preprocess:packer', 'uglify:packer', 'clean:packer']);
    });

    grunt.registerTask('lodash', function() {
        grunt.log.ok('Creating custom lodash.');
        grunt.task.run([
            'shell:lodash',
            'preprocess:lodash',
            'string-replace:lodash',
            'clean:lodash']);
    });

    grunt.registerTask('build:docs', function(){
        var taskDone = this.async();
        grunt.log.writeln('Building docs..');
        exec('jsdoc -r -d ./docs/api/ ./dist/radic.all.js', function(error, stdout, stderr){
            if(error) grunt.fail.fatal(error);
            grunt.log.ok('Docs created.');
            console.log('jsdoc', error, stdout, stderr);
            taskDone();
        })
    });

    grunt.registerTask('radicjs:docs', 'Create API documentation', ['radicjs:fast', 'build:docs']);

    grunt.registerTask('radicjs', 'Builds radic JS. More information use radicjs:help ', function (build) {
        grunt.log.subhead('RadicJS Builder');

        if (typeof build === 'undefined') {
            grunt.fail.fatal('You have not selected a build. Use grunt radic:help for more information');
        } else if (build === 'help') {
            grunt.log.ok('printing help')
        } else if (build === 'custom') {
            var custom = {
                lodash: grunt.option('lodash').split(', '),
                modules: grunt.option('modules').split(', '),
                externals: grunt.option('externals') || [],
                filename: grunt.option('filename')
            }
        } else if (build === 'fast') {
            var buildTask = 'build:*:+' + config.builds.all.modules.join(':+');
            grunt.config.set('radicjs', {
                filename: grunt.option('filename') || config.builds.all.filename,
                build: 'all'
            });
            grunt.task.run(buildTask);
        } else {
            build = build || config.default;
            var cfg = config.builds[build];
            var task = 'build:*:+' + cfg.modules.join(':+');

            var _ignoredeps = grunt.option('ignoredeps');
            if (typeof ignoredeps !== 'undefined') {
                _ignoredeps = _ignoredeps.split(',')
            }
            var ignoredeps = _ignoredeps || cfg.ignoredeps || [];
            var packer = {};
            _.each(config.modules_external_deps, function (name, module) {
                if (cfg.modules.indexOf(module) > -1) {
                    if (ignoredeps.indexOf(module) === -1) {
                        packer[name.toUpperCase()] = true;
                    }
                } else {
                    packer[name.toUpperCase()] = true;
                }
            });

            grunt.config.set('radicjs', {
                filename: grunt.option('filename') || cfg.filename,
                build: build,
                packer: packer,
                lodash: cfg.lodash.join(',')
            });

            grunt.log.ok('Initialized. ');
            grunt.task.run(['showtime', 'lodash', task, 'uglify:radicjs', 'packer']);
        }
    });
}
