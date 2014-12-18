angular.module('shouldReturnValidator', [])

.directive('shouldReturn', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            ngModel.$validators.shouldReturn = function (modelValue, viewValue) {
                return viewValue.indexOf('return ') != -1;
            };
        }
    };
})

;
