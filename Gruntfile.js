module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-ng-annotate');
    grunt.loadNpmTasks('grunt-html2js');
    grunt.loadNpmTasks('grunt-injector');
    grunt.loadNpmTasks("grunt-jscs");
    grunt.loadNpmTasks('grunt-crx');

    grunt.registerTask('default', ['jshint', 'jscs', 'build', 'karma:watch']);
    grunt.registerTask('build', ['clean', 'html2js', 'concat', 'copy', 'injector', 'updateManifest']);
    grunt.registerTask('release', ['jshint', 'jscs', 'karma:continuous', 'build', 'ngAnnotate', 'uglify', 'crx']);

    grunt.registerTask('updateManifest', function () {
        var manifestFile = grunt.config('build_dir') + '/manifest.json';
        if (!grunt.file.exists(manifestFile)) {
            grunt.log.error("Manifest file: " + projectFile + " not found");
            return true;
        }
        var manifest = grunt.file.readJSON(manifestFile);
        manifest.options_page = manifest.options_page.replace('src/', '');
        for (var size in manifest.icons) {
            manifest.icons[size] = manifest.icons[size].replace('src/', '');
        }
        grunt.file.write(manifestFile, JSON.stringify(manifest, null, 2));
    });

    var karmaConfig = function(configFile, customOptions) {
        var options = { configFile: configFile, keepalive: true };
        var travisOptions = process.env.TRAVIS && { browsers: ['Chrome'], reporters: 'dots' };
        return grunt.util._.extend(options, customOptions, travisOptions);
    };

    grunt.initConfig({
        /*
            build_dir - for current build
            bin_dur - for package
            build_dir/lib_dir - for vendor js files
            build_dir/assets_dir - for vendor and project assets
         */
        build_dir: 'build',
        bin_dir: 'bin',
        lib_dir: 'lib',
        assets_dir: 'assets',

        pkg: grunt.file.readJSON('package.json'),

        banner:
        '/*\n' +
        ' <%=pkg.title || pkg.name %> v<%= pkg.version %>\n' +
        ' (c) <%= grunt.template.today("yyyy") %> <%= pkg.author %> <%= pkg.homepage ? "" + pkg.homepage + "\\n" : "" %>' +
        ' License: <%= pkg.license %>\n*/\n',

        app_files: {
            js: ['src/**/*.js', '!src/**/*.mock.js',  '!src/**/*.spec.js'],
            jsunit: ['src/**/*.spec.js'],

            tpl: {
                app: ['src/app/**/*.html'],
                common: ['src/common/**/*.html']
            }
        },

        clean: ['<%= build_dir %>/*'],

        copy: {
            index: {
                src: ['src/index.html'],
                dest: '<%= build_dir %>/index.html'
            },
            assets: {
                files: [{ dest: '<%= build_dir %>/<%= assets_dir %>', src: '**', expand: true, cwd: 'src/assets/' }]
            },
            vendor_assets: {
                files: [
                    {
                        dest: '<%= build_dir %>/<%= assets_dir %>/css', src: '*.css', expand: true, cwd: 'vendor/angular/'
                    },
                    {
                        dest: '<%= build_dir %>/<%= assets_dir %>/css', src: 'bootstrap.css', expand: true, cwd: 'vendor/bootstrap/dist/css/'
                    },
                    {
                        dest: '<%= build_dir %>/<%= assets_dir %>/fonts', src: '**', expand: true, cwd: 'vendor/bootstrap/dist/fonts/'
                    },
                    {
                        dest: '<%= build_dir %>/<%= assets_dir %>/css', src: '*.css', expand: true, cwd: 'vendor/codemirror/lib/'
                    },
                    {
                        dest: '<%= build_dir %>/<%= assets_dir %>/css/theme', src: '*.css', expand: true, cwd: 'vendor/codemirror/theme/'
                    }
                ]
            },
            manifest: {
                files: [{ dest: '<%= build_dir %>/', src: 'manifest.json', expand: true, cwd: '.' }]
            }
        },

        karma: {
            continuous: { options: karmaConfig('karma/pigeon.conf.js', { singleRun: true }) },
            watch: { options: karmaConfig('karma/pigeon.conf.js', { singleRun: false, autoWatch: true}) }
        },

        html2js: {
            app: {
                options: {
                    base: 'src/'
                },
                src: ['<%= app_files.tpl.app %>'],
                dest: '<%= build_dir %>/templates/app.js',
                module: 'templates.app'
            },
            common: {
                options: {
                    base: 'src/'
                },
                src: ['<%= app_files.tpl.common %>'],
                dest: '<%= build_dir %>/templates/common.js',
                module: 'templates.common'
            }
        },

        concat: {
            build: {
                options: {
                    banner: "<%= banner %>"
                },
                src: ['<%= app_files.js %>', '<%= html2js.app.dest %>', '<%= html2js.common.dest %>'],
                dest: '<%= build_dir %>/<%= pkg.name %>.js'
            },
            angular: {
                src: ['vendor/angular/angular.min.js',
                    'vendor/angular-route/angular-route.min.js',
                    'vendor/angular-messages/angular-messages.min.js',
                    'vendor/angular-translate/angular-translate.min.js',
                    'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js'],
                dest: '<%= build_dir %>/<%= lib_dir %>/angular.js'
            },
            jquery: {
                src: ['vendor/jquery/dist/jquery.min.js'],
                dest: '<%= build_dir %>/<%= lib_dir %>/jquery.js'
            },
            bootstrap: {
                src: ['vendor/bootstrap/dist/js/bootstrap.min.js',
                    'vendor/angular-bootstrap/ui-bootstrap.min.js',
                    'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js'],
                dest: '<%= build_dir %>/<%= lib_dir %>/bootstrap.js'
            },
            codemirror: {
                src: ['vendor/codemirror/lib/codemirror.js',
                    'vendor/codemirror/mode/javascript/javascript.js',
                    'vendor/angular-ui-codemirror/ui-codemirror.min.js'
                ],
                dest: '<%= build_dir %>/<%= lib_dir %>/codemirror.js'
            }
        },

        ngAnnotate: {
            release: {
                files: [
                    {
                        src: ['<%= pkg.name %>.js'],
                        cwd: '<%= build_dir %>',
                        dest: '<%= build_dir %>',
                        expand: true
                    }
                ]
            }
        },

        uglify: {
            build: {
                options: {
                    banner: "<%= banner %>",
                    // TODO: fix this
                    mangle: false
                },
                src: ['<%= app_files.js %>', '<%= html2js.app.dest %>', '<%= html2js.common.dest %>'],
                dest: '<%= build_dir %>/<%= pkg.name %>.js'
            }
        },

        jshint: {
            files: ['Gruntile.js', '<%= app_files.js %>', '<%= app_files.jsunit %>'],
            options: {
                curly: true,
                eqeqeq: true,
                immed: true,
                latedef: true,
                newcap: true,
                noarg: true,
                sub: true,
                boss: true,
                eqnull: true,
                globals: {}
            }
        },

        jscs: {
            src: ['Gruntile.js', '<%= app_files.js %>', '<%= app_files.jsunit %>'],
            options: {
                config: '.jscsrc'
            }
        },

        injector: {
            options: {
                ignorePath: '<%= build_dir %>/'
            },
            local_dependencies: {
                files: {
                    '<%= build_dir %>/index.html': ['<%= build_dir %>/<%= lib_dir %>/jquery.js',
                        '<%= build_dir %>/<%= lib_dir %>/angular.js',
                        '<%= build_dir %>/<%= lib_dir %>/bootstrap.js',
                        '<%= build_dir %>/<%= lib_dir %>/codemirror.js',
                        '<%= build_dir %>/<%= pkg.name %>.js',
                        '<%= build_dir %>/<%= assets_dir %>/css/*.css',
                        '<%= build_dir %>/<%= assets_dir %>/css/theme/*.css'],
                }
            }
        },

        crx: {
            package: {
                "src": "<%= build_dir %>",
                "dest": "<%= bin_dir %>",
            }
        }
    });
};
