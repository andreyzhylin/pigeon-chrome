angular.module('pigeon.overviewController', [
    'pigeon.pageService',
    'pigeon.testService',
    'pigeon.overviewService',

    'pigeon.statuses',

    'pigeon.testStatus',
    'ui.bootstrap',
    'icon'
])

.controller('OverviewController', ['$scope', 'pageService', 'testService', 'overviewService', 'statuses',
    function ($scope, pageService, testService, overviewService, statuses) {
        this.shouldHideSuccess = false;

        $scope.pages = pageService.getAll();
        $scope.statuses = statuses;

        this.countTests = function (page, status) {
            var count = 0;
            angular.forEach(page.tests, function (test) {
                if (test.status === status) {
                    count++;
                }
            });
            return count;
        };

        this.shouldHideTest = function (test) {
            return (test.status === statuses.SUCCESS) && this.shouldHideSuccess;
        };

        this.removeTest = function (test) {
            testService.remove(test);
        };

        this.removePage = function (page) {
            pageService.remove(page);
        };

        this.refreshTest = function (test) {
            overviewService.executeTest(test);
        };

        this.refreshPage = function (page, onlySuccess) {
            overviewService.executePage(page, onlySuccess);
        };

        this.refreshAll = function (onlySuccess) {
            overviewService.executeAll($scope.pages, onlySuccess);
        };
    }
])

;
