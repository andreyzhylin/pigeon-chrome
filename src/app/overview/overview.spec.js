describe('OverviewController', function () {
    beforeEach(module('pigeon.overview'));
    beforeEach(module('pigeon.core'));
    beforeEach(inject(function (_$controller_, _pigeon_) {
        pigeon = _pigeon_;
        pigeon.init();
        this.controller = _$controller_('OverviewController', {$scope: {}, pigeon: pigeon});
    }));

    describe('on init', function () {
        it('should load pages', function () {
            expect(this.controller.pages).toBe(pigeon.storage.pages);
        });
    });

    describe('countTests', function () {
        it('should count ERROR tests', function () {
            var count = this.controller.countTests(this.controller.pages[0], this.controller.statuses.ERROR);
            expect(count).toBe(2);
        });
        it('should count SUCCESS tests', function () {
            var count = this.controller.countTests(this.controller.pages[0], this.controller.statuses.SUCCESS);
            expect(count).toBe(1);
        });
        it('should count FAILED tests', function () {
            var count = this.controller.countTests(this.controller.pages[0], this.controller.statuses.FAILED);
            expect(count).toBe(1);
        });
    });

    describe('shouldHideTest', function () {
        it('should hide success tests if checkbox is checked', function () {
            var test = {status: this.controller.statuses.SUCCESS};
            this.controller.shouldHideSuccess = false;
            var result = this.controller.shouldHideTest(test);
            expect(result).toBeFalsy();
            this.controller.shouldHideSuccess = true;
            result = this.controller.shouldHideTest(test);
            expect(result).toBeTruthy();
            test.status = this.controller.statuses.FAILED;
            result = this.controller.shouldHideTest(test);
            expect(result).toBeFalsy();
            test.status = this.controller.statuses.ERROR;
            result = this.controller.shouldHideTest(test);
            expect(result).toBeFalsy();
            test.status = this.controller.statuses.UNKNOWN;
            result = this.controller.shouldHideTest(test);
            expect(result).toBeFalsy();
        });
    });
});
