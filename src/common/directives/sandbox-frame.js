angular.module('sandbox-frame', ['pigeon.core'])

.directive('sandboxFrame', ['pigeon', function (pigeon) {
    return {
        restrict: 'A',
        template: '<iframe id="' + pigeon.options.SANDBOX_FRAME_ID + '" src="sandbox.html"></iframe>',
        scope: {}
    };
}])

;
