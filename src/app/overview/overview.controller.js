angular.module('pigeon.overviewController', [
    'pigeon.pageService',
    'pigeon.testService',
    'pigeon.overviewService',
    'pigeon.settingsService',

    'pigeon.statuses',

    'pigeon.testStatus',
    'ui.bootstrap',
    'icon'
])

.controller('OverviewController', [
    '$scope', '$translate', 'pageService', 'testService', 'overviewService', 'settingsService', 'statuses',
    function ($scope, $translate, pageService, testService, overviewService, settingsService, statuses) {
        $scope.alerts.length = 0;
        if (pageService.getAll().length === 0) {
            $scope.alerts.push({
                type: 'info',
                translationKey: 'ALERT_NEW_USER',
                message: $translate.instant('ALERT_NEW_USER')
            });
        }

        this.shouldHideSuccess = settingsService.getHideSuccess();

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

        this.saveHideSuccess = function () {
            settingsService.setHideSuccess(this.shouldHideSuccess);
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
