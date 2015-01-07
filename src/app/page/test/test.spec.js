beforeEach(module('pigeon.testService'));

describe('testService', function () {
    beforeEach(inject(function (_$rootScope_, _testService_) {
        $rootScope = _$rootScope_;
        testService = _testService_;
    }));

    beforeEach(function (done) {
        testService.init();
        $rootScope.$digest();
        done();
    });

    it('should init', function () {
        expect(testService.getAll(0).length).toBeGreaterThan(0);
    });

    it('should allow obtaining test by index', function () {
        expect(testService.getAll(0)[0].description).toBe(testService.get(0, 0).description);
        expect(testService.getAll(0)[0].code).toBe(testService.get(0, 0).code);
        expect(testService.getAll(0)[0].isDebug).toBe(testService.get(0, 0).isDebug);
    });

    it('should allow addition of tests', function (done) {
        var test = {};
        test.description = 'New test';
        expect(testService.getAll(0)).not.toContain(test);
        testService.add(test, 0);
        testService.init().then(function () {
            expect(testService.getAll(0)).toContain(test);
        });
        $rootScope.$digest();
        done();
    });

    it('should allow tests editing', function () {
        var test = {};
        test.description = 'New test';
        test.code = 'New code';
        var test1_0 = testService.getAll(1, 0);
        expect(test1_0.description).not.toBe(test.description);
        expect(test1_0.code).not.toBe(test.code);
        testService.edit(test, 1, 0);
        test1_0 = testService.get(1, 0);
        expect(test1_0.description).toBe(test.description);
        expect(test1_0.code).toBe(test.code);
    });

    it('should allow deletion of tests', function () {
        var test = testService.get(1, 0);
        testService.remove(test);
        expect(testService.getAll(1)).not.toContain(test);
    });
});

describe('TestController', function () {
    beforeEach(module('pigeon.testController'));
    beforeEach(inject(function (_$rootScope_, _testService_) {
        $rootScope = _$rootScope_;
        testService = _testService_;
    }));

    beforeEach(function (done) {
        testService.init();
        $rootScope.$digest();
        done();
    });

    describe('on adding test', function () {
        beforeEach(inject(function (_$controller_) {
            this.pageIndex = 0;
            $scope = $rootScope.$new();
            this.controller = _$controller_('TestController',
                {$scope: $scope, $routeParams: {pageIndex: this.pageIndex}, testService: testService});
        }));

        it('should has empty model', function () {
            expect($scope.test).toBeDefined();
            expect($scope.test.description).toBeUndefined();
            expect($scope.test.code).toBeUndefined();
            expect($scope.test.isDebug).toBeUndefined();
        });

        it('should save model', function () {
            $scope.test.description = 'Add test';
            $scope.test.code = 'return true;';
            $scope.test.isDebug = true;

            expect(testService.getAll(this.pageIndex)).not.toContain($scope.test);
            this.controller.save();
            expect(testService.getAll(this.pageIndex)).toContain($scope.test);
        });
    });

    describe('on edition test', function () {
        beforeEach(inject(function (_$controller_) {
            this.pageIndex = 0;
            this.testIndex = 0;
            $scope = $rootScope.$new();
            this.controller = _$controller_('TestController', {
                $scope: $scope,
                $routeParams: {pageIndex: this.pageIndex, testIndex: this.testIndex},
                testService: testService
            });
        }));

        it('should load model', function () {
            expect($scope.test).toBeDefined();
            expect($scope.test.description).toBe(testService.get(this.pageIndex, this.testIndex).description);
            expect($scope.test.code).toBe(testService.get(this.pageIndex, this.testIndex).code);
        });

        it('should save model', function () {
            $scope.test.description = 'Edit test gui';
            $scope.test.code = 'return 1 === 1;';
            var oldTest = testService.get(this.pageIndex, this.testIndex);
            expect(oldTest.description).not.toBe($scope.test.description);
            expect(oldTest.code).not.toBe($scope.test.code);
            this.controller.save();
            oldTest = testService.get(this.pageIndex, this.testIndex);
            expect(oldTest.description).toBe($scope.test.description);
            expect(oldTest.code).toBe($scope.test.code);
        });
    });
});
