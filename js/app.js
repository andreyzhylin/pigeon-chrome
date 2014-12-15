(function() {
	var app = angular.module('pigeonApp', [
		'ngRoute',
		'ngMessages',
		'ui.bootstrap',
		'ui.codemirror',
		'pigeonControllers',
		'pigeonDirectives'
	]);

	app.config(['$routeProvider',
	  	function($routeProvider) {
	    	$routeProvider.
	      		when('/pages', {
	        		templateUrl: 'templates/test-results.partial.html',
					controller: 'MainController',
					controllerAs: 'mainCtrl'
	      		}).
	      		when('/pages/add', {
	        		templateUrl: 'templates/page-form.partial.html',
	        		controller: 'PageController',
	        		controllerAs: 'pageCtrl'
	      		}).
	      		when('/pages/edit/:pageIndex', {
	      			templateUrl: 'templates/page-form.partial.html',
	      			controller: 'PageController',
	        		controllerAs: 'pageCtrl'
	      		}).
	      		when('/pages/:pageIndex/tests/add', {
	        		templateUrl: 'templates/test-form.partial.html',
	        		controller: 'TestController',
	        		controllerAs: 'testCtrl'
	      		}).
	      		when('/pages/:pageIndex/tests/edit/:testIndex', {
	        		templateUrl: 'templates/test-form.partial.html',
	        		controller: 'TestController',
	        		controllerAs: 'testCtrl'
	      		}).
	      		otherwise({
	        		redirectTo: '/pages'
	      		});
	  	}
	]);

	app.config(['$compileProvider',
	    function($compileProvider) {   
	        $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
		}
	]);

	// Bootstrap
	angular.element(document).ready(function() {
	  	angular.bootstrap(document, ['pigeonApp']);
	});
})();

