var pigeonDirectives = angular.module('pigeonDirectives', []);

pigeonDirectives.directive('icon', function() {
	var linkFunction = function(scope, element, attributes) {
	    scope.name = attributes.icon;
	};
	return {
		restrict: 'A',
		templateUrl: 'templates/icon.widget.html',
		link: linkFunction,
		scope: {}
	};
});

pigeonDirectives.directive('pageStatusSummary', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/page-status-summary.widget.html'
	};
});