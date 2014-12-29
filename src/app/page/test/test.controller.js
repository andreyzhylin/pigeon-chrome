angular.module('pigeon.testController', [
    'pigeon.testService',
    'pigeon.methods',
    'shouldReturnValidator',
    'ui.codemirror'
])

.controller('TestController', ['$routeParams', '$location', 'testService', 'methods',
    function ($routeParams, $location, testService, methods) {
        this.methods = [];
        this.methods.push({name: 'METHOD_OPEN_TAB', value: methods.OPEN_TAB});
        this.methods.push({name: 'METHOD_GET_REQUEST', value: methods.GET_REQUEST});
        this.methods.push({name: 'METHOD_POST_REQUEST', value: methods.POST_REQUEST});

        this.test = {};
        this.test.method = methods.OPEN_TAB;
        if (angular.isDefined($routeParams.testIndex)) {
            this.test = angular.copy(testService.get($routeParams.pageIndex, $routeParams.testIndex));
        }
        if (angular.isUndefined(this.test.params)) {
            this.test.params = [];
            this.test.params.push({key: '', value: ''});
        }

        this.editorOptions = {
            lineWrapping: true,
            lineNumbers: true,
            mode: 'javascript',
            theme: 'elegant'
        };

        this.saveTest = function () {
            if (angular.isDefined($routeParams.testIndex)) {
                testService.edit(this.test, $routeParams.pageIndex, $routeParams.testIndex);
            } else {
                testService.add(this.test, $routeParams.pageIndex);
            }
            $location.path('/');
        };

        this.isRequest = function () {
            return this.test.method !== methods.OPEN_TAB;
        };
    }
])

;
