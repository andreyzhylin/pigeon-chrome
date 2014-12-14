var pigeonDirectives = angular.module('pigeonDirectives', []);

pigeonDirectives.directive('icon', function() {
	return {
		restrict: 'A',
		templateUrl: 'templates/icon.widget.html',
		link: function(scope, element, attributes) {
		    scope.name = attributes.icon;
		},
		scope: {}
	};
});

pigeonDirectives.directive('pageStatusSummary', function() {
	return {
		restrict: 'E',
		templateUrl: 'templates/page-status-summary.widget.html'
	};
});

pigeonDirectives.directive('fixUrl', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attr, ngModel) {
			function fixProtocol(url) {
				if (!/^https?:\/\//i.test(url)) {
				    url = 'http://' + url;
				}
				return url;
			}
			ngModel.$parsers.push(fixProtocol);
		}
	};
});

pigeonDirectives.directive('shouldReturn', function() {
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function(scope, element, attr, ngModel) {
			ngModel.$validators.shouldReturn = function(modelValue, viewValue) {
				return viewValue.indexOf('return ') != -1;
			};
		}
	};
});