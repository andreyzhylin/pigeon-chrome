angular.module('icon', [])

.directive('icon', function () {
    return {
        restrict: 'A',
        template: '<span class="glyphicon glyphicon-{{ name }}" aria-hidden="true"></span>',
        link: function (scope, element, attributes) {
            scope.name = attributes.icon;
        },
        scope: {}
    };
})

;
