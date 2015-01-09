angular.module('pigeon.settingsController', [
    'pigeon.settingsService'
])

.controller('SettingsController', ['$scope', '$location', 'settingsService',
    function ($scope, $location, settingsService) {
        $scope.executionTimeout = settingsService.getExecutionTimeout();

        this.save = function () {
            settingsService.setExecutionTimeout($scope.executionTimeout);
            $location.path('/');
        };
    }
])

;
