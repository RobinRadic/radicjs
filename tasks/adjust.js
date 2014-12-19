var _ = require('lodash');
var exec = require('child_process').exec;

module.exports = function (grunt) {

    var origHeader = grunt.log.header;

    grunt.log.header = function () {
    };

    function createTag(callback) {
        return function (error, stdout, stderr) {
            callback();
        };
    }

    grunt.registerTask('tag:patch', 'Add a new version. Increase patch version by 1.', function () {
        var taskDone = this.async();
        exec('npm version patch', createTag(taskDone));
    });
    grunt.registerTask('tag:minor', 'Add a new version. Increase minor version by 1.', function () {
        var taskDone = this.async();
        exec('npm version minor', createTag(taskDone));
    });
    grunt.registerTask('tag:major', 'Add a new version. Increase major version by 1.', function () {
        var taskDone = this.async();
        exec('npm version major', createTag(taskDone));
    });

    grunt.config('availabletasks', {           // task
        tasks: {
            options: {
                filter: 'exclude',
                showTasks: ['user'],
                tasks: ['default', 'showtime', 'header', 'build', 'custom', 'dist', 'lodash', 'packer'],
                groups: {
                    'Development': ['watch', 'serve', 'radicjs', 'docs:build'],
                    'Testing': ['test'],
                    'Deploying': ['tag:patch', 'tag:minor', 'tag:major', 'publish', 'docs:publish']
                }
            }
        }
    });


    grunt.registerTask('showtime', function () {
        require('time-grunt')(grunt);
    });

    grunt.registerTask('default', 'Overview', function () {
        grunt.task.run(['availabletasks']);
    });
    grunt.registerTask('header', function (target) {
        grunt.log.header = target == 'enable' ? origHeader : function () {
        };
    });

    var origRun = grunt.task.run;
    grunt.task.run = function () {
        var args = _.toArray(arguments);
        if (args[0] !== 'default' && args[0][0] !== 'availabletasks' && args[0] !== 'availabletasks:tasks') {
            //grunt.log.header = origHeader;
        }
        // console.log(_.toArray(arguments));
        origRun.apply(grunt.task, args);
    };
};
