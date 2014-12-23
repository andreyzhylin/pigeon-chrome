angular.module('pigeon.test', ['pigeon.core'])

.controller('TestController', ['$routeParams', '$location', 'pigeon', function ($routeParams, $location, pigeon) {
    this.methods = [];
    this.methods.push({name: 'METHOD_OPEN_TAB', value: pigeon.methods.OPEN_TAB});
    this.methods.push({name: 'METHOD_GET_REQUEST', value: pigeon.methods.GET_REQUEST});
    this.methods.push({name: 'METHOD_POST_REQUEST', value: pigeon.methods.POST_REQUEST});

    this.test = {};
    this.test.method = pigeon.methods.OPEN_TAB;
    if (angular.isDefined($routeParams.testIndex)) {
        this.test = angular.copy(pigeon.storage.getTest($routeParams.pageIndex, $routeParams.testIndex));
    }
    if (angular.isUndefined(this.test.params)) {
        this.test.params = [];
    }
    this.test.params.push({key: '', value: ''});

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

    this.isRequest = function () {
        return this.test.method !== pigeon.methods.OPEN_TAB;
    };
}])

;
