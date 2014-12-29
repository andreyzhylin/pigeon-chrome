angular.module('pigeon.app', [
    'ngRoute',
    'ngMessages',

    'pascalprecht.translate',

    'pigeon.pageService',

    'pigeon.testController',
    'pigeon.pageController',
    'pigeon.overviewController',

    'pigeon.sandboxFrame',

    'languagePicker',
])

.config(['$routeProvider',
    function ($routeProvider) {
    // Add global resolve (init pigeon storage)
    angular.extend({}, $routeProvider, {
        when: function (path, route) {
            route.resolve = (route.resolve) ? route.resolve : {};
            angular.extend(route.resolve, {
                data: function (pageService) {
                    return pageService.init();
                }
            });
            $routeProvider.when(path, route);
            return this;
        }
    })
    .when('/pages', {
        templateUrl: 'app/overview/overview.html',
        controller: 'OverviewController',
        controllerAs: 'overviewCtrl'
    })
    .when('/pages/add', {
        templateUrl: 'app/page/page-form.html',
        controller: 'PageController',
        controllerAs: 'pageCtrl'
    })
    .when('/pages/edit/:pageIndex', {
        templateUrl: 'app/page/page-form.html',
        controller: 'PageController',
        controllerAs: 'pageCtrl'
    })
    .when('/pages/:pageIndex/tests/add', {
        templateUrl: 'app/page/test/test-form.html',
        controller: 'TestController',
        controllerAs: 'testCtrl'
    })
    .when('/pages/:pageIndex/tests/edit/:testIndex', {
        templateUrl: 'app/page/test/test-form.html',
        controller: 'TestController',
        controllerAs: 'testCtrl'
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

.run(function ($rootScope) {
    $rootScope.SANDBOX_FRAME_ID = 'sandboxFrame';
})

;

angular.element(document).ready(function () {
    angular.bootstrap(document, ['pigeon.app']);
});
