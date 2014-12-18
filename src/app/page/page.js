angular.module('pigeon.page', ['pigeon.core'])

.controller('PageController', ['$routeParams', '$location', 'pigeon', function ($routeParams, $location, pigeon) {
    this.page = {};
    if (angular.isDefined($routeParams.pageIndex)) {
        this.page = angular.copy(pigeon.storage.getPage($routeParams.pageIndex));
    }

    this.savePage = function () {
        if (angular.isDefined($routeParams.pageIndex)) {
            pigeon.storage.editPage(this.page, $routeParams.pageIndex);
        } else {
            pigeon.storage.addPage(this.page);
        }
        $location.path('/');
    };
}])

;
