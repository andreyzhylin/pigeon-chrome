describe('Pigeon', function () {
    beforeEach(module('pigeon.pageService'));
    beforeEach(module('pigeon.testService'));
    beforeEach(module('pigeon.fileService'));
    beforeEach(module('pigeon.overviewService'));
    beforeEach(module('pigeon.statuses'));
    beforeEach(module('pigeon.overviewController'));

    beforeEach(inject(
        function (_$rootScope_, _pageService_, _testService_, _fileService_, _overviewService_, _statuses_) {
            $rootScope = _$rootScope_;
            $rootScope.alerts = [];
            pageService = _pageService_;
            testService = _testService_;
            fileService = _fileService_;
            overviewService = _overviewService_;
            statuses = _statuses_;
        }
    ));

    beforeEach(function (done) {
        pageService.init();
        fileService.init();
        $rootScope.$digest();
        done();
    });

    describe('overviewService', function () {
        describe('while executing scripts', function () {
            beforeEach(function () {
                this.page = pageService.get(0);
            });

            it('should correctly execute SUCCESS test', function (done) {
                var successTest = this.page.tests[0];
                overviewService.executeTest(successTest).then(function () {
                    expect(successTest.status).toBe(statuses.SUCCESS);
                    expect(successTest.isExecuting).toBeFalsy();
                    expect(successTest.errorMessage).toBe('');
                    pageService.init().then(function () {
                        expect(pageService.get(0).tests[0].status).toBe(statuses.SUCCESS);
                    });
                });
                expect(successTest.status).toBe(statuses.UNKNOWN);
                expect(successTest.isExecuting).toBeTruthy();
                $rootScope.$digest();
                done();
            });

            it('should correctly execute FAILED test', function (done) {
                var failedTest = this.page.tests[1];
                overviewService.executeTest(failedTest).then(function () {
                    expect(failedTest.status).toBe(statuses.FAILED);
                    expect(failedTest.errorMessage).toMatch('Always FAILED');
                });
                $rootScope.$digest();
                done();
            });

            it('should correctly execute ERROR test', function (done) {
                var errorTest = this.page.tests[2];
                overviewService.executeTest(errorTest).then(function () {
                    expect(errorTest.status).toBe(statuses.ERROR);
                    expect(errorTest.errorMessage).toMatch(/ERROR_NOT_BOOLEAN/);
                });
                $rootScope.$digest();
                done();
            });

            it('should correctly execute all page', function (done) {
                var successTest = this.page.tests[0];
                var failedTest = this.page.tests[1];
                var errorTest = this.page.tests[2];
                overviewService.executePage(this.page).then(function () {
                    expect(successTest.status).toBe(statuses.SUCCESS);
                    expect(successTest.isExecuting).toBeFalsy();
                    expect(successTest.errorMessage).toBe('');
                    expect(failedTest.status).toBe(statuses.FAILED);
                    expect(failedTest.errorMessage).toMatch('Always FAILED');
                    expect(errorTest.status).toBe(statuses.ERROR);
                    expect(errorTest.errorMessage).toMatch(/ERROR_NOT_BOOLEAN/);
                    expect(pageService.get(0).tests[3].status).toBe(statuses.ERROR);
                    pageService.init().then(function () {
                        expect(pageService.get(0).tests[3].status).toBe(statuses.ERROR);
                    });
                });
                $rootScope.$digest();
                done();
            });

            it('should correctly execute tests with exceptions', function (done) {
                var errorTest = this.page.tests[3];
                overviewService.executeTest(errorTest).then(function () {
                    expect(errorTest.status).toBe(statuses.ERROR);
                    expect(errorTest.errorMessage).toMatch('of undefined');
                });
                $rootScope.$digest();
                done();
            });

            it('should execute all files before tests', function (done) {
                var test = this.page.tests[0];
                var oldCode = test.code;
                test.code = 'pigeon.expect(\'File are loaded\', myModule.test === 42); pigeon.resolve();';
                overviewService.executeTest(test).then(function () {
                    expect(test.status).toBe(statuses.SUCCESS);
                    test.code = oldCode;
                });
                $rootScope.$digest();
                done();
            });
        });
    });

    describe('OverviewController', function () {
        beforeEach(inject(function ($rootScope, _$controller_) {
            $scope = $rootScope.$new();
            this.controller = _$controller_('OverviewController', {
                $scope: $scope,
                pageService: pageService,
                testService: testService,
                overviewService: overviewService,
                statuses: statuses
            });
        }));

        describe('on init', function () {
            it('should load pages', function () {
                expect($scope.pages).toBe(pageService.getAll());
            });
        });

        describe('countTests', function () {
            it('should count ERROR tests', function (done) {
                var countTests = this.controller.countTests;
                overviewService.executePage($scope.pages[0]).then(function () {
                    var count = countTests($scope.pages[0], statuses.ERROR);
                    expect(count).toBe(2);
                });
                $rootScope.$digest();
                done();
            });
            it('should count SUCCESS tests', function (done) {
                var countTests = this.controller.countTests;
                overviewService.executePage($scope.pages[0]).then(function () {
                    var count = countTests($scope.pages[0], statuses.SUCCESS);
                    expect(count).toBe(1);
                });
                $rootScope.$digest();
                done();
            });
            it('should count FAILED tests', function (done) {
                var countTests = this.controller.countTests;
                overviewService.executePage($scope.pages[0]).then(function () {
                    var count = countTests($scope.pages[0], statuses.FAILED);
                    expect(count).toBe(1);
                });
                $rootScope.$digest();
                done();
            });
        });

        describe('shouldHideTest', function () {
            it('should hide success tests if checkbox is checked', function () {
                var test = {status: statuses.SUCCESS};
                this.controller.shouldHideSuccess = false;
                expect(this.controller.shouldHideTest(test)).toBeFalsy();
                this.controller.shouldHideSuccess = true;
                expect(this.controller.shouldHideTest(test)).toBeTruthy();
                test.status = statuses.FAILED;
                expect(this.controller.shouldHideTest(test)).toBeFalsy();
                test.status = statuses.ERROR;
                expect(this.controller.shouldHideTest(test)).toBeFalsy();
                test.status = statuses.UNKNOWN;
                expect(this.controller.shouldHideTest(test)).toBeFalsy();
            });
        });
    });
});
