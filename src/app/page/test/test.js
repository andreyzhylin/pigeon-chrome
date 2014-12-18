angular.module('pigeon.test', ['pigeon.core'])

.controller('TestController', ['$routeParams', '$location', 'pigeon', function ($routeParams, $location, pigeon) {
    this.test = {};
    if (angular.isDefined($routeParams.testIndex)) {
        this.test = angular.copy(pigeon.storage.getTest($routeParams.pageIndex, $routeParams.testIndex));
    }

    this.editorOptions = {
        lineWrapping: true,
        lineNumbers: true,
        mode: 'javascript',
        theme: 'elegant'
    };

    this.saveTest = function () {
        if (angular.isDefined($routeParams.testIndex)) {
            pigeon.storage.editTest(this.test, $routeParams.pageIndex, $routeParams.testIndex);
        } else {
            pigeon.storage.addTest(this.test, $routeParams.pageIndex);
        }
        $location.path('/');
    };
}])

;
