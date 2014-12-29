angular.module('pigeon.sandboxFrame', [])

.directive('sandboxFrame', function () {
    return {
        restrict: 'E',
        template: '<iframe id="{{SANDBOX_FRAME_ID}}" src="app/sandbox/sandbox.html"></iframe>'
    };
})

;
