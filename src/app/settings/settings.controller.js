angular.module('pigeon.settingsController', [
    'pigeon.settingsService',
    'pigeon.pageService'
])

.controller('SettingsController', ['$scope', '$location', 'settingsService', 'pageService',
    function ($scope, $location, settingsService, pageService) {
        $scope.executionTimeout = settingsService.getExecutionTimeout();
        $scope.importFile = {};

        var data = pageService.export();
        var blob = new Blob([data], {type: 'application/json'});
        $scope.export_url = URL.createObjectURL(blob);

        this.save = function () {
            settingsService.setExecutionTimeout($scope.executionTimeout);
            if (angular.isDefined($scope.importFile.code)) {
                pageService.import($scope.importFile.code);
            }
            $location.path('/');
        };
    }
])

;
