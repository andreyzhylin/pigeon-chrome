describe('settingsService', function () {
	beforeEach(module('pigeon.settingsService'));

	beforeEach(inject(function (_$rootScope_, _settingsService_) {
        $rootScope = _$rootScope_;
        settingsService = _settingsService_;
    }));

    beforeEach(function (done) {
        settingsService.init();
        $rootScope.$digest();
        done();
    });

    it('should load execution timer from storage', function () {
        expect(settingsService.getExecutionTimeout()).toBe(5000);
    });

    it('should save execution timer to storage', function (done) {
        settingsService.setExecutionTimeout(10000);
        settingsService.init().then(function () {
            expect(settingsService.getExecutionTimeout()).toBe(10000);
            settingsService.setExecutionTimeout(5000);
        });
        $rootScope.$digest();
        done();
    });

    it('should load language from storage', function () {
        expect(settingsService.getLanguage()).toBe('EN');
    });

    it('should save language to storage', function (done) {
        settingsService.setLanguage('RU');
        settingsService.init().then(function () {
            expect(settingsService.getLanguage()).toBe('RU');
            settingsService.setLanguage('EN');
        });
        $rootScope.$digest();
        done();
    });

    it('should load hideSuccess from storage', function () {
        expect(settingsService.getHideSuccess()).toBeFalsy();
    });

    it('should save hideSuccess to storage', function (done) {
        settingsService.setHideSuccess(true);
        settingsService.init().then(function () {
            expect(settingsService.getHideSuccess()).toBeTruthy();
            settingsService.setHideSuccess(false);
        });
        $rootScope.$digest();
        done();
    });
});

describe('SettingsController', function () {
    beforeEach(module('pigeon.settingsController'));
    beforeEach(module('pigeon.settingsService'));

    beforeEach(inject(function (_$rootScope_, _settingsService_) {
        $rootScope = _$rootScope_;
        $rootScope.alerts = [];
        settingsService = _settingsService_;
    }));

    beforeEach(function (done) {
        settingsService.init();
        $rootScope.$digest();
        done();
    });

    describe('on edition settings', function () {
        beforeEach(inject(function (_$controller_) {
            $scope = $rootScope.$new();
            this.controller = _$controller_('SettingsController', {$scope: $scope, settingsService: settingsService});
        }));

        it('should load execution timeout', function () {
            expect($scope.executionTimeout).toBe(5000);
        });

        it('should save execution timeout', function (done) {
            $scope.executionTimeout = 10000;
            this.controller.save();
            settingsService.init().then(function () {
                expect(settingsService.getExecutionTimeout()).toBe(10000);
                settingsService.setExecutionTimeout(5000);
            });
            $rootScope.$digest();
            done();
        });
    });
});
