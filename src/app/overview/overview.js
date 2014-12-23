angular.module('pigeon.overview', [
    'ui.bootstrap',
    'icon',
    'pigeon.core',
])

.controller('OverviewController', ['$scope', 'pigeon', function ($scope, pigeon) {
    this.shouldHideSuccess = false;

    this.pages = [];
    this.pages = pigeon.storage.getPages();

    this.statuses = pigeon.statuses;

    this.statusCssClasses = [];
    this.statusCssClasses[this.statuses.UNKNOWN] = 'status-unknown';
    this.statusCssClasses[this.statuses.SUCCESS] = 'status-success';
    this.statusCssClasses[this.statuses.FAILED] = 'status-failed';
    this.statusCssClasses[this.statuses.ERROR] = 'status-error';

    this.statusNames = [];
    this.statusNames[this.statuses.UNKNOWN] = 'UNKNOWN';
    this.statusNames[this.statuses.SUCCESS] = 'SUCCESS';
    this.statusNames[this.statuses.FAILED] = 'FAILED';
    this.statusNames[this.statuses.ERROR] = 'ERROR';

    this.countTests = function (page, status) {
        var count = 0;
        angular.forEach(page.tests, function (test) {
            if (test.status === status) {
                count++;
            }
        });
        return count;
    };

    this.getStatusCssClass = function (status) {
        return this.statusCssClasses[status];
    };

    this.getStatusName = function (status) {
        return this.statusNames[status];
    };

    this.shouldHideTest = function (test) {
        return (test.status === pigeon.statuses.SUCCESS) && this.shouldHideSuccess;
    };

    this.removeTest = function (test) {
        pigeon.storage.removeTest(test);
    };

    this.removePage = function (page) {
        pigeon.storage.removePage(page);
    };

    this.refreshTest = function (test) {
        pigeon.executeTest(test, this.testCompleteCallback);
    };

    this.refreshPage = function (page) {
        pigeon.executePage(page, this.testCompleteCallback);
    };

    this.refreshAll = function () {
        pigeon.executeAll(this.testCompleteCallback);
    };

    this.testCompleteCallback = function (test) {
        $scope.$apply();
    };
}])

;
