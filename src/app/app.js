angular.module('pigeon.app', [
    'ngRoute',
    'ngMessages',

    'ui.codemirror',
    'pascalprecht.translate',

    'pigeon.core',

    'pigeon.overview',
    'pigeon.page',
    'pigeon.test',

    'language-picker',
    'fixUrl',
    'shouldReturnValidator'
])

.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/pages', {
                templateUrl: 'app/overview/overview.html',
                controller: 'OverviewController',
                controllerAs: 'overviewCtrl'
            }).
            when('/pages/add', {
                templateUrl: 'app/page/page-form.html',
                controller: 'PageController',
                controllerAs: 'pageCtrl'
            }).
            when('/pages/edit/:pageIndex', {
                templateUrl: 'app/page/page-form.html',
                controller: 'PageController',
                controllerAs: 'pageCtrl'
            }).
            when('/pages/:pageIndex/tests/add', {
                templateUrl: 'app/page/test/test-form.html',
                controller: 'TestController',
                controllerAs: 'testCtrl'
            }).
            when('/pages/:pageIndex/tests/edit/:testIndex', {
                templateUrl: 'app/page/test/test-form.html',
                controller: 'TestController',
                controllerAs: 'testCtrl'
            }).
            otherwise({
                redirectTo: '/pages'
            });
    }
])

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

.run(['pigeon', function (pigeon) {
    pigeon.init();
}])

;

angular.element(document).ready(function () {
    angular.bootstrap(document, ['pigeon.app']);
});
