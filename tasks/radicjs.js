
var _ = require('lodash');

module.exports = function(grunt) {
    'use strict';

    var config = grunt.file.readYAML('_config.yml');

    var defaults = config.builds[config.default];


    grunt.registerTask('lodash:radicjs', [
        'shell:lodash',
        'preprocess:lodash',
        'string-replace:lodash',
        'clean:lodash'
    ]);

    grunt.registerTask('radicjs', 'Builds radic JS. Use the --build option to create a preconfigured build according to _config.yml values. ', function (build) {
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

                //grunt.log.writeln('modules_external_deps:name ' + name);
                //grunt.log.writeln('modules_external_deps:i ' + i);
            });

            grunt.config.set('radicjs', {
                filename: grunt.option('filename') || cfg.filename,
                build: build,
                packer: packer,
                lodash: cfg.lodash.join(',')
            });

            grunt.task.run(['lodash:radicjs', task, 'uglify:radicjs', 'string-replace:packer', 'copy:packer', 'preprocess:packer', 'uglify:packer', 'clean:packer']);

            grunt.log.writeln('build: ' + build);
            grunt.log.writeln('task: ' + task);
            grunt.log.writeflags(grunt.config.getRaw('radicjs'), 'radicjs config');
        }


        // grunt.task.run([ 'shell:build'  ])
    });
}