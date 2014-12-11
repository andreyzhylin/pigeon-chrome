(function() {
	var app = angular.module('pigeonApp', [
		'ngRoute',
		'pigeonControllers',
		'pigeonDirectives'
	]);

	app.config(['$routeProvider',
	  	function($routeProvider) {
	    	$routeProvider.
	      		when('/overview', {
	        		templateUrl: 'templates/test-results.partial.html',
					controller: 'MainController',
					controllerAs: 'mainCtrl'
	      		}).
	      		when('/addPage', {
	        		templateUrl: 'templates/page-form.partial.html',
	        		controller: "PageController",
	        		controllerAs: 'pageCtrl'
	      		}).
	      		otherwise({
	        		redirectTo: '/overview'
	      		});
	  	}]);

	// Bootstrap
	angular.element(document).ready(function() {
	  	angular.bootstrap(document, ['pigeonApp']);
	});
})();

