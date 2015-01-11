angular.module('pigeon.testController', [
    'pigeon.testService',

    'ui.codemirror'
])

.controller('TestController', ['$scope', '$routeParams', '$location', 'testService',
    function ($scope, $routeParams, $location, testService) {
        $scope.alerts.length = 0;
        $scope.test = {};
        if (angular.isDefined($routeParams.testIndex)) {
            $scope.test = angular.copy(testService.get($routeParams.pageIndex, $routeParams.testIndex));
        }

        this.editorOptions = {
            lineWrapping: true,
            lineNumbers: true,
            mode: 'javascript',
            theme: 'elegant'
        };

        this.save = function () {
            if (angular.isDefined($routeParams.testIndex)) {
                testService.edit($scope.test, $routeParams.pageIndex, $routeParams.testIndex);
            } else {
                testService.add($scope.test, $routeParams.pageIndex);
            }
            $location.path('/');
        };
    }
])

;
