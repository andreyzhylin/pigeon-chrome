beforeEach(module('pigeon.testService'));
beforeEach(module('pigeon.methods'));

describe('testService', function () {
    beforeEach(inject(function (_$rootScope_, _testService_, _methods_) {
        $rootScope = _$rootScope_;
        methods = _methods_;
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
    });

    it('should allow addition of tests', function (done) {
        var test = {};
        test.description = 'New test';
        test.method = methods.OPEN_TAB;
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
        test.method = methods.OPEN_TAB;
        var test1_0 = testService.getAll(1, 0);
        expect(test1_0.description).not.toBe(test.description);
        expect(test1_0.code).not.toBe(test.code);
        testService.edit(test, 1, 0);
        test1_0 = testService.get(1, 0);
        expect(test1_0.description).toBe(test.description);
        expect(test1_0.code).toBe(test.code);
    });

    it('should add params', function () {
        var params = [{key:'without value', value:''},
                      {key:'', value:'without key'},
                      {key:'', value:''},
                      {key:'key', value:'value'}];
        var test = {};
        test.description = 'Request';
        test.method = methods.GET_REQUEST;
        test.params = params;
        testService.add(test, 0);
        lastTest = testService.get(0, testService.getAll(0).length - 1);
        expect(lastTest.description).toBe(test.description);
        expect(lastTest.method).toBe(test.method);
        expect(lastTest.params.length).toBe(1);
        expect(lastTest.params[0].key).toBe('key');
        expect(lastTest.params[0].value).toBe('value');
    });

    it('should edit params', function () {
        var params = [{key:'without value', value:''},
                      {key:'', value:'without key'},
                      {key:'', value:''},
                      {key:'key', value:'value'}];
        var test = {};
        test.method = methods.POST_REQUEST;
        test.params = params;
        var test1_0 = testService.get(1, 0);
        expect(test1_0.description).not.toBe(test.description);
        expect(test1_0.params).not.toBe(test.params);
        testService.edit(test, 1, 0);
        test1_0 = testService.get(1, 0);
        expect(test1_0.description).toBe(test.description);
        expect(test1_0.method).toBe(test.method);
        expect(test1_0.params.length).toBe(1);
        expect(test1_0.params[0].key).toBe('key');
        expect(test1_0.params[0].value).toBe('value');
    });

    it('should allow deletion of tests', function () {
        var test = testService.get(1, 0);
        testService.remove(test);
        expect(testService.getAll(1)).not.toContain(test);
    });
});

describe('TestController', function () {
    beforeEach(module('pigeon.testController'));
    beforeEach(inject(function (_$rootScope_, _testService_, _methods_) {
        $rootScope = _$rootScope_;
        testService = _testService_;
        methods = _methods_;
    }));

    beforeEach(function (done) {
        testService.init();
        $rootScope.$digest();
        done();
    });

    describe('on adding test', function () {
        beforeEach(inject(function (_$controller_) {
            this.pageIndex = 0;
            this.controller = _$controller_('TestController',
                {$scope: {}, $routeParams: {pageIndex: this.pageIndex}, testService: testService, methods: methods});
        }));

        it('should has empty model', function () {
            expect(this.controller.test).toBeDefined();
            expect(this.controller.test.description).toBeUndefined();
            expect(this.controller.test.code).toBeUndefined();
            expect(this.controller.test.method).toBe(methods.OPEN_TAB);
        });

        it('should save model', function () {
            this.controller.test.description = 'Add test';
            this.controller.test.code = 'return true;';
            this.controller.test.method = methods.OPEN_TAB;

            expect(testService.getAll(this.pageIndex)).not.toContain(this.controller.test);
            this.controller.save();
            expect(testService.getAll(this.pageIndex)).toContain(this.controller.test);
        });
    });

    describe('on edition test', function () {
        beforeEach(inject(function (_$controller_) {
            this.pageIndex = 0;
            this.testIndex = 0;
            this.controller = _$controller_('TestController', {
                $scope: {},
                $routeParams: {pageIndex: this.pageIndex, testIndex: this.testIndex},
                testService: testService
            });
        }));

        it('should load model', function () {
            expect(this.controller.test).toBeDefined();
            expect(this.controller.test.description).toBe(testService.get(this.pageIndex, this.testIndex).description);
            expect(this.controller.test.code).toBe(testService.get(this.pageIndex, this.testIndex).code);
            expect(this.controller.test.method).toBe(testService.get(this.pageIndex, this.testIndex).method);
        });

        it('should save model', function () {
            this.controller.test.description = 'Edit test gui';
            this.controller.test.code = 'return 1 === 1;';
            this.controller.test.method = methods.OPEN_TAB;
            var oldTest = testService.get(this.pageIndex, this.testIndex);
            expect(oldTest.description).not.toBe(this.controller.test.description);
            expect(oldTest.code).not.toBe(this.controller.test.code);
            this.controller.save();
            oldTest = testService.get(this.pageIndex, this.testIndex);
            expect(oldTest.description).toBe(this.controller.test.description);
            expect(oldTest.code).toBe(this.controller.test.code);
        });
    });
});
