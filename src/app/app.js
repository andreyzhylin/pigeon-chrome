angular.module('pigeon.app', [
    'ngRoute',
    'ngMessages',

    'pascalprecht.translate',

    'pigeon.pageService',
    'pigeon.testService',
    'pigeon.fileService',
    'pigeon.settingsService',

    'pigeon.testController',
    'pigeon.pageController',
    'pigeon.overviewController',
    'pigeon.fileController',
    'pigeon.settingsController',

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
                data: function ($q, pageService, fileService, settingsService) {
                    return $q.all([].concat(pageService.init(), fileService.init()));
                }
            }
        })
        .when('/pages/add', {
            templateUrl: 'app/page/page-form.html',
            controller: 'PageController',
            controllerAs: 'pageCtrl',
            resolve: {
                data: function ($q, pageService, settingsService) {
                    return $q.all([].concat(pageService.init(), settingsService.init()));
                }
            }
        })
        .when('/pages/edit/:pageIndex', {
            templateUrl: 'app/page/page-form.html',
            controller: 'PageController',
            controllerAs: 'pageCtrl',
            resolve: {
                data: function ($q, pageService, settingsService) {
                    return $q.all([].concat(pageService.init(), settingsService.init()));
                }
            }
        })
        .when('/pages/:pageIndex/tests/add', {
            templateUrl: 'app/page/test/test-form.html',
            controller: 'TestController',
            controllerAs: 'testCtrl',
            resolve: {
                data: function ($q, testService, settingsService) {
                    return $q.all([].concat(testService.init(), settingsService.init()));
                }
            }
        })
        .when('/pages/:pageIndex/tests/edit/:testIndex', {
            templateUrl: 'app/page/test/test-form.html',
            controller: 'TestController',
            controllerAs: 'testCtrl',
            resolve: {
                data: function ($q, testService, settingsService) {
                    return $q.all([].concat(testService.init(), settingsService.init()));
                }
            }
        })
        .when('/files', {
            templateUrl: 'app/file/files.html',
            controller: 'FileController',
            controllerAs: 'fileCtrl',
            resolve: {
                data: function ($q, fileService, settingsService) {
                    return $q.all([].concat(fileService.init(), settingsService.init()));
                }
            }
        })
        .when('/files/add', {
            templateUrl: 'app/file/file-form.html',
            controller: 'FileController',
            controllerAs: 'fileCtrl',
            resolve: {
                data: function ($q, fileService, settingsService) {
                    return $q.all([].concat(fileService.init(), settingsService.init()));
                }
            }
        })
        .when('/files/edit/:fileIndex', {
            templateUrl: 'app/file/file-form.html',
            controller: 'FileController',
            controllerAs: 'fileCtrl',
            resolve: {
                data: function ($q, fileService, settingsService) {
                    return $q.all([].concat(fileService.init(), settingsService.init()));
                }
            }
        })
        .when('/settings', {
            templateUrl: 'app/settings/settings-form.html',
            controller: 'SettingsController',
            controllerAs: 'settingsCtrl',
            resolve: {
                data: function ($q, settingsService, pageService) {
                    return $q.all([].concat(settingsService.init(), pageService.init()));
                }
            }
        })
        .otherwise({
            redirectTo: '/pages'
        });
}])

.config(['$compileProvider',
    function ($compileProvider) {
        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension|blob):/);
    }
])

.config(function ($translateProvider) {
    $translateProvider.useStaticFilesLoader({
        prefix: 'assets/translations/',
        suffix: '.json'
    });
    $translateProvider.preferredLanguage('en');
})

.run(function ($rootScope, $translate) {
    $rootScope.alerts = [];
    $rootScope.closeAlert = function (index) {
        $rootScope.alerts.splice(index, 1);
    };
    $rootScope.$on('$translateChangeSuccess', function () {
        angular.forEach($rootScope.alerts, function (alert) {
            $translate(alert.translationKey).then(function (translation) {
                alert.message = translation;
            });
        });
    });
})

;

angular.element(document).ready(function () {
    angular.bootstrap(document, ['pigeon.app']);
});
