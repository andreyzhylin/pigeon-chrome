angular.module('sandboxFrame', ['pigeon.core'])

.directive('sandboxFrame', ['pigeon', function (pigeon) {
    return {
        restrict: 'E',
        template: '<iframe id="' + pigeon.options.SANDBOX_FRAME_ID + '" src="sandbox.html"></iframe>',
        scope: {}
    };
}])

;
