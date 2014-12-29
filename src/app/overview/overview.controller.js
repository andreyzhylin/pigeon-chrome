angular.module('pigeon.overviewController', [
    'pigeon.pageService',
    'pigeon.testService',
    'pigeon.overviewService',

    'pigeon.statuses',

    'pigeon.testStatus',
    'ui.bootstrap',
    'icon',
])

.controller('OverviewController', ['pageService', 'testService', 'overviewService', 'statuses',
    function (pageService, testService, overviewService, statuses) {
        this.shouldHideSuccess = false;
        this.pages = pageService.getAll();

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

        this.refreshPage = function (page) {
            overviewService.executePage(page);
        };

        this.refreshAll = function () {
            overviewService.executeAll(this.pages);
        };
    }
])

;
