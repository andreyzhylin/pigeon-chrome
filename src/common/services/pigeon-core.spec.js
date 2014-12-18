describe('Pigeon сore', function () {
    beforeEach(module('pigeon.core'));
    beforeEach(inject(function (_pigeon_) {
        pigeon = _pigeon_;
        pigeon.init();
    }));

    describe('executeTest method', function () {
        beforeEach(function () {
            this.page = pigeon.storage.getPages()[0];
        });

        it('should be defined and public', function () {
            expect(pigeon.executeTest).toBeDefined();
        });

        it('should allow execution without callback function', function () {
            var test = this.page.tests[0];
            pigeon.executeTest(test);
        });

        it('should correctly set success status', function () {
            var successTest = this.page.tests[0];
            successTest.status = pigeon.statuses.UNKNOWN;
            pigeon.executeTest(successTest);
            expect(successTest.status).toBe(pigeon.statuses.SUCCESS);
        });

        it('should correctly set failed status', function () {
            var failedTest = this.page.tests[1];
            failedTest.status = pigeon.statuses.UNKNOWN;
            pigeon.executeTest(failedTest);
            expect(failedTest.status).toBe(pigeon.statuses.FAILED);
        });

        it('should correctly set error status', function () {
            var errorTest = this.page.tests[2];
            errorTest.status = pigeon.statuses.UNKNOWN;
            pigeon.executeTest(errorTest);
            expect(errorTest.status).toBe(pigeon.statuses.ERROR);
        });
    });

    describe('Pigeon executePage method', function () {
        beforeEach(function () {
            this.page = pigeon.storage.getPages()[0];
        });

        it('should execute all tests on page', function () {
            var callback = jasmine.createSpy('callback');
            pigeon.executePage(this.page, callback);
            expect(callback.calls.length).toEqual(this.page.tests.length);
        });
    });

    describe('Pigeon storage', function () {
        beforeEach(function () {
            this.pages = pigeon.storage.getPages();
        });

        it('should set page links to tests', function () {
            expect(this.pages[0].tests[0].page).toBe(this.pages[0]);
        });

        it('should allow obtaining test by index', function () {
            expect(this.pages[0].tests[0]).toBe(pigeon.storage.getTest(0, 0));
        });

        it('should allow addition of tests', function () {
            var test = {};
            test.description = 'New test';
            var lastTest = this.pages[0].tests[this.pages[0].tests.length - 1];
            expect(lastTest.description).not.toBe(test.description);
            pigeon.storage.addTest(test, 0);
            lastTest = this.pages[0].tests[this.pages[0].tests.length - 1];
            expect(lastTest.description).toBe(test.description);
        });

        it('should allow tests editing', function () {
            var test = {};
            test.description = 'New test';
            test.code = 'New code';
            var test1_0 = this.pages[1].tests[0];
            expect(test1_0.description).not.toBe(test.description);
            expect(test1_0.code).not.toBe(test.url);
            pigeon.storage.editTest(test, 1, 0);
            test1_0 = this.pages[1].tests[0];
            expect(test1_0.description).toBe(test.description);
            expect(test1_0.code).toBe(test.code);
        });

        it('should allow deletion of tests', function () {
            var test = this.pages[1].tests[0];
            pigeon.storage.removeTest(test);
            expect(this.pages[1].tests).not.toContain(test);
        });

        it('should allow obtaining page by index', function () {
            expect(this.pages[0]).toBe(pigeon.storage.getPage(0));
        });

        it('should allow addition of pages', function () {
            var page = {};
            page.description = 'New page';
            var lastPage = this.pages[this.pages.length - 1];
            expect(lastPage.description).not.toBe(page.description);
            pigeon.storage.addPage(page);
            lastPage = this.pages[this.pages.length - 1];
            expect(lastPage.description).toBe(page.description);
        });

        it('should allow pages editing', function () {
            var page = {};
            page.description = 'New description';
            page.url = 'New url';
            expect(this.pages[1].description).not.toBe(page.description);
            expect(this.pages[1].url).not.toBe(page.url);
            pigeon.storage.editPage(page, 1);
            expect(this.pages[1].description).toBe(page.description);
            expect(this.pages[1].url).toBe(page.url);
        });

        it('should allow deletion of pages', function () {
            var page = this.pages[1];
            pigeon.storage.removePage(page);
            expect(this.pages).not.toContain(page);
        });
    });
});
