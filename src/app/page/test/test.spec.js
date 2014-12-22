describe('TestController', function () {
    beforeEach(module('pigeon.test'));
    beforeEach(module('pigeon.core'));
    beforeEach(inject(function (_pigeon_) {
        pigeon = _pigeon_;
        pigeon.init();
    }));

    describe('on adding test', function () {
        beforeEach(inject(function (_$controller_) {
            this.pageIndex = 0;
            this.controller = _$controller_('TestController',
                {$scope: {}, $routeParams: {pageIndex: this.pageIndex}, pigeon: pigeon});
        }));

        it('should has empty model', function () {
            expect(this.controller.test).toBeDefined();
            expect(this.controller.test.description).toBeUndefined();
            expect(this.controller.test.code).toBeUndefined();
            expect(this.controller.test.method).toBe(pigeon.methods.OPEN_TAB);
        });

        it('should save model', function () {
            this.controller.test.description = 'Add test';
            this.controller.test.code = 'return true;';
            this.controller.test.method = pigeon.methods.OPEN_TAB;

            var pages = pigeon.storage.getPages();
            var lastTest = pages[this.pageIndex].tests[pages[this.pageIndex].tests.length - 1];
            expect(lastTest.description).not.toBe(this.controller.test.description);
            expect(lastTest.code).not.toBe(this.controller.test.code);
            this.controller.saveTest();
            lastTest = pages[this.pageIndex].tests[pages[this.pageIndex].tests.length - 1];
            expect(lastTest.description).toBe(this.controller.test.description);
            expect(lastTest.code).toBe(this.controller.test.code);
        });
    });

    describe('on edition test', function () {
        beforeEach(inject(function (_$controller_) {
            this.pageIndex = 0;
            this.testIndex = 0;
            this.controller = _$controller_('TestController',
                {$scope: {}, $routeParams: {pageIndex: this.pageIndex, testIndex: this.testIndex}, pigeon: pigeon});
        }));

        it('should load model', function () {
            var pages = pigeon.storage.getPages();

            expect(this.controller.test).toBeDefined();
            expect(this.controller.test.description).toBe(pages[this.pageIndex].tests[this.testIndex].description);
            expect(this.controller.test.code).toBe(pages[this.pageIndex].tests[this.testIndex].code);
            expect(this.controller.test.method).toBe(pages[this.pageIndex].tests[this.testIndex].method);
        });

        it('should save model', function () {
            this.controller.test.description = 'Edit test gui';
            this.controller.test.code = 'return 1 === 1;';
            this.controller.test.method = pigeon.methods.OPEN_TAB;

            var pages = pigeon.storage.getPages();
            expect(pages[this.pageIndex].tests[this.testIndex].description).not.toBe(this.controller.test.description);
            expect(pages[this.pageIndex].tests[this.testIndex].code).not.toBe(this.controller.test.code);
            this.controller.saveTest();
            expect(pages[this.pageIndex].tests[this.testIndex].description).toBe(this.controller.test.description);
            expect(pages[this.pageIndex].tests[this.testIndex].code).toBe(this.controller.test.code);
        });
    });
});
