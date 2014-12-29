angular.module('pigeon.testStatus', [
    'pigeon.statuses',
])

.directive('testStatus', ['statuses', function (statuses) {
    var statusCssClasses = [];
    statusCssClasses[statuses.UNKNOWN] = 'status-unknown';
    statusCssClasses[statuses.SUCCESS] = 'status-success';
    statusCssClasses[statuses.FAILED] = 'status-failed';
    statusCssClasses[statuses.ERROR] = 'status-error';

    var statusNames = [];
    statusNames[statuses.UNKNOWN] = 'UNKNOWN';
    statusNames[statuses.SUCCESS] = 'SUCCESS';
    statusNames[statuses.FAILED] = 'FAILED';
    statusNames[statuses.ERROR] = 'ERROR';

    return {
        restrict: 'E',
        templateUrl: 'common/directives/test-status/test-status.html',
        link: function (scope) {
            scope.$watch('test.status', function (value) {
                scope.statusClass = statusCssClasses[value];
                scope.statusName = statusNames[value];
                scope.shouldShowErrorMessage = value === statuses.ERROR;
            });
        }
    };
}])

;
