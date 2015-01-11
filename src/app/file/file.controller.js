angular.module('pigeon.fileController', [
    'pigeon.fileService',

    'fileread'
])

.controller('FileController', ['$scope', '$routeParams', '$location', 'fileService',
    function ($scope, $routeParams, $location, fileService) {
        $scope.alerts.length = 0;
        $scope.file = {};
        $scope.files = fileService.getAll();

        if (angular.isDefined($routeParams.fileIndex)) {
            $scope.file = angular.copy(fileService.get($routeParams.fileIndex));
        }

        this.editorOptions = {
            lineWrapping: true,
            lineNumbers: true,
            mode: 'javascript',
            theme: 'elegant'
        };

        this.save = function () {
            if (angular.isDefined($routeParams.fileIndex)) {
                fileService.edit($scope.file, $routeParams.fileIndex);
            } else {
                fileService.add($scope.file);
            }
            $location.path('/files');
        };

        this.remove = function (file) {
            fileService.remove(file);
        };
    }
])

;
