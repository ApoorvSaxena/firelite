'use strict';

module.exports = function(grunt) {
	grunt.initConfig({
		serve: {
			options: {
				port: 9000
			}
		},
		watch: {
			css: {
				files: 'src/*.*',
				tasks: ['build'],
				options: {
					livereload: true,
				}
			},
		},
		uglify: {
			js: {
				files: {
					'dist/game.min.js': ['src/game.js']
				}
			}
		},
		cssmin: {
			css: {
				files: {
					'dist/style.min.css': ['src/style.css']
				}
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: {
					'index.html': 'src/index.html'
				}
			}
		}
	});

	grunt.registerTask('build', [
		'uglify',
		'cssmin',
		'htmlmin'
	]);

	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-serve');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-htmlmin');
};