angular.module('pigeon.pageController', [
    'pigeon.pageService',

    'fixUrl',
])

.controller('PageController', ['$routeParams', '$location', 'pageService',
    function ($routeParams, $location, pageService) {
        this.page = {};
        if (angular.isDefined($routeParams.pageIndex)) {
            this.page = angular.copy(pageService.get($routeParams.pageIndex));
        }

        this.savePage = function () {
            if (angular.isDefined($routeParams.pageIndex)) {
                pageService.edit(this.page, $routeParams.pageIndex);
            } else {
                pageService.add(this.page);
            }
            $location.path('/');
        };
    }
])

;
