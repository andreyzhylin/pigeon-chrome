angular.module('pigeon.pageController', [
    'pigeon.pageService',

    'fixUrl'
])

.controller('PageController', ['$scope', '$routeParams', '$location', 'pageService',
    function ($scope, $routeParams, $location, pageService) {
        $scope.page = {};
        if (angular.isDefined($routeParams.pageIndex)) {
            $scope.page = angular.copy(pageService.get($routeParams.pageIndex));
        }

        this.save = function () {
            if (angular.isDefined($routeParams.pageIndex)) {
                pageService.edit($scope.page, $routeParams.pageIndex);
            } else {
                pageService.add($scope.page);
            }
            $location.path('/');
        };
    }
])

;
