angular.module('pigeon.app', [
    'ngRoute',
    'ngMessages',

    'pascalprecht.translate',

    'pigeon.pageService',
    'pigeon.testService',
    'pigeon.fileService',

    'pigeon.testController',
    'pigeon.pageController',
    'pigeon.overviewController',
    'pigeon.fileController',

    'languagePicker',

    'templates.app'
])

.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider
        .when('/pages', {
            templateUrl: 'app/overview/overview.html',
            controller: 'OverviewController',
            controllerAs: 'overviewCtrl',
            resolve: {
                data: function ($q, pageService, fileService) {
                    return $q.all([].concat(pageService.init(), fileService.init()));
                }
            }
        })
        .when('/pages/add', {
            templateUrl: 'app/page/page-form.html',
            controller: 'PageController',
            controllerAs: 'pageCtrl',
            resolve: {
                data: function (pageService) {
                    return pageService.init();
                }
            }
        })
        .when('/pages/edit/:pageIndex', {
            templateUrl: 'app/page/page-form.html',
            controller: 'PageController',
            controllerAs: 'pageCtrl',
            resolve: {
                data: function (pageService) {
                    return pageService.init();
                }
            }
        })
        .when('/pages/:pageIndex/tests/add', {
            templateUrl: 'app/page/test/test-form.html',
            controller: 'TestController',
            controllerAs: 'testCtrl',
            resolve: {
                data: function (testService) {
                    return testService.init();
                }
            }
        })
        .when('/pages/:pageIndex/tests/edit/:testIndex', {
            templateUrl: 'app/page/test/test-form.html',
            controller: 'TestController',
            controllerAs: 'testCtrl',
            resolve: {
                data: function (testService) {
                    return testService.init();
                }
            }
        })
        .when('/files', {
            templateUrl: 'app/file/files.html',
            controller: 'FileController',
            controllerAs: 'fileCtrl',
            resolve: {
                data: function (fileService) {
                    return fileService.init();
                }
            }
        })
        .when('/files/add', {
            templateUrl: 'app/file/file-form.html',
            controller: 'FileController',
            controllerAs: 'fileCtrl',
            resolve: {
                data: function (fileService) {
                    return fileService.init();
                }
            }
        })
        .when('/files/edit/:fileIndex', {
            templateUrl: 'app/file/file-form.html',
            controller: 'FileController',
            controllerAs: 'fileCtrl',
            resolve: {
                data: function (fileService) {
                    return fileService.init();
                }
            }
        })
        .otherwise({
            redirectTo: '/pages'
        });
}])

.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
    }
])

.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/translations/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
})

;

angular.element(document).ready(function () {
    angular.bootstrap(document, ['pigeon.app']);
});
