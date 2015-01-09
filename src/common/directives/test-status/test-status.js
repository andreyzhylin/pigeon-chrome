angular.module('pigeon.testStatus', [
    'pigeon.statuses',

    'pascalprecht.translate',

    'templates.common'
])

.directive('testStatus', ['$translate', 'statuses', function ($translate, statuses) {
    var statusCssClasses = [];
    statusCssClasses[statuses.UNKNOWN] = 'status-unknown';
    statusCssClasses[statuses.SUCCESS] = 'status-success';
    statusCssClasses[statuses.FAILED] = 'status-failed';
    statusCssClasses[statuses.ERROR] = 'status-error';

    var statusNames = [];
    statusNames[statuses.UNKNOWN] = 'TEST_STATUS_UNKNOWN';
    statusNames[statuses.SUCCESS] = 'TEST_STATUS_SUCCESS';
    statusNames[statuses.FAILED] = 'TEST_STATUS_FAILED';
    statusNames[statuses.ERROR] = 'TEST_STATUS_ERROR';

    return {
        restrict: 'E',
        templateUrl: 'common/directives/test-status/test-status.html',
        link: function (scope) {
            scope.$watch('test.status', function (value) {
                scope.statusClass = statusCssClasses[value];
                $translate(statusNames[value]).then(function (translatedName) {
                    scope.statusName = translatedName;
                });
                scope.shouldShowErrorMessage = value === statuses.ERROR || value === statuses.FAILED;
            });
        }
    };
}])

;
