angular.module('pigeon.settingsController', [
    'pigeon.settingsService',
    'pigeon.pageService',

    'pascalprecht.translate'
])

.controller('SettingsController', ['$scope', '$http', '$translate', '$location', 'settingsService', 'pageService',
    function ($scope, $http, $translate, $location, settingsService, pageService) {
        $scope.alerts.length = 0;
        $scope.executionTimeout = settingsService.getExecutionTimeout();
        $scope.importFile = {};

        var data = pageService.export();
        var blob = new Blob([data], {type: 'application/json'});
        $scope.export_url = URL.createObjectURL(blob);

        this.save = function () {
            $scope.alerts.length = 0;
            settingsService.setExecutionTimeout($scope.executionTimeout);
            if (angular.isDefined($scope.importFile.code)) {
                try {
                    pageService.import($scope.importFile.code);
                    $scope.alerts.push({
                        type: 'success',
                        translationKey: 'ALERT_IMPORT_SUCCESS',
                        message: $translate.instant('ALERT_IMPORT_SUCCESS')
                    });
                } catch (e) {
                    $scope.alerts.push({
                        type: 'danger',
                        message: 'Import error: ' + e.message
                    });
                }
            }
            $scope.alerts.push({
                type: 'success',
                translationKey: 'ALERT_SETTINGS_SUCCESS',
                message: $translate.instant('ALERT_SETTINGS_SUCCESS')
            });
        };

        this.initSampleProject = function () {
            $http.get('assets/sample_tests/tests.' + $translate.use() + '.json').success(function (data) {
                try {
                    pageService.import(JSON.stringify(data));
                    $scope.alerts.push({
                        type: 'success',
                        translationKey: 'ALERT_SAMPLE_SUCCESS',
                        message: $translate.instant('ALERT_SAMPLE_SUCCESS')
                    });
                } catch (e) {
                    $scope.alerts.push({
                        type: 'danger',
                        message: e.message
                    });
                }
            });
        };
    }
])

;
