angular.module('fixUrl', [])

.directive('fixUrl', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attr, ngModel) {
            function fixProtocol(url) {
                return !/^https?:\/\//i.test(url) ? 'http://' + url : url;
            }
            ngModel.$parsers.push(fixProtocol);
        }
    };
})

;
