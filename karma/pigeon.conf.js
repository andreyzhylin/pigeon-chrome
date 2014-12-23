// Karma configuration
// Generated on Sat Dec 13 2014 14:05:54 GMT+0300 (RTZ 2 (зима))

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '../',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine-ajax', 'jasmine'],


    // list of files / patterns to load in the browser
    files: [
        'vendor/angular/angular.min.js',
        'vendor/angular-route/angular-route.min.js',
        'vendor/angular-messages/angular-messages.min.js',
        'vendor/angular-mocks/angular-mocks.js',
        'vendor/angular-translate/angular-translate.min.js',
        'vendor/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',

        'vendor/jquery/dist/jquery.min.js',
        'vendor/bootstrap/dist/js/bootstrap.min.js',
        'vendor/angular-bootstrap/ui-bootstrap.min.js',
        'vendor/angular-bootstrap/ui-bootstrap-tpls.min.js',
        'vendor/codemirror/lib/codemirror.js',
        'vendor/codemirror/mode/javascript/javascript.js',
        'vendor/angular-ui-codemirror/ui-codemirror.min.js',

        'src/common/services/chrome-api.mock.js',
        'src/common/services/chrome-service.js',
        'src/common/services/pigeon-core.js',

        'src/app/app.js',

        'src/app/overview/overview.js',
        'src/app/page/page.js',
        'src/app/page/test/test.js',

        'src/common/directives/language-picker/language-picker.js',
        'src/common/directives/icon.js',
        'src/common/directives/fix-url.js',
        'src/common/directives/should-return-validator.js',
        'src/common/directives/sandbox-frame.js',

        'src/**/*.spec.js'
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
        'src/**/*.js': 'coverage'
    },

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress', 'coverage'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  });
};
