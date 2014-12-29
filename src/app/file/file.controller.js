angular.module('pigeon.fileController', [
    'pigeon.fileService',

    'fileread',
])

.controller('FileController', ['$routeParams', '$location', 'fileService',
    function ($routeParams, $location, fileService) {
        this.file = {};
        this.files = fileService.getAll();

        if (angular.isDefined($routeParams.fileIndex)) {
            this.file = angular.copy(fileService.get($routeParams.fileIndex));
        }

        this.editorOptions = {
            lineWrapping: true,
            lineNumbers: true,
            mode: 'javascript',
            theme: 'elegant'
        };

        this.save = function () {
            if (angular.isDefined($routeParams.fileIndex)) {
                fileService.edit(this.file, $routeParams.fileIndex);
            } else {
                fileService.add(this.file);
            }
            $location.path('/files');
        };

        this.remove = function (file) {
            fileService.remove(file);
        };
    }
])

;
