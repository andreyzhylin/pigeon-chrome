describe('pageService', function () {
    beforeEach(module('pigeon.pageService'));
    beforeEach(module('pigeon.statuses'));

    beforeEach(inject(function (_$rootScope_, _pageService_, _statuses_) {
        $rootScope = _$rootScope_;
        statuses = _statuses_;
        pageService = _pageService_;
    }));

    beforeEach(function (done) {
        pageService.init();
        $rootScope.$digest();
        done();
    });

    it('should load data from storage', function () {
        expect(pageService.getAll().length).toBeGreaterThan(0);
    });

    it('should allow obtaining page by index', function () {
        expect(pageService.getAll()[0]).toBe(pageService.get(0));
    });

    it('should allow addition of pages', function (done) {
        var page = {};
        page.description = 'New page';
        page.url = 'New url';
        pageService.add(page);
        pageService.init().then(function () {
            expect(pageService.getAll()).toContain(page);
        });
        $rootScope.$digest();
        done();
    });

    it('should allow pages editing', function () {
        var page = {};
        page.description = 'New description';
        page.url = 'New url';
        var page1 = pageService.get(1);
        expect(page1.description).not.toBe(page.description);
        expect(page1.url).not.toBe(page.url);
        pageService.edit(page, 1);
        page1 = pageService.get(1);
        expect(page1.description).toBe(page.description);
        expect(page1.url).toBe(page.url);
    });

    it('should set UNKWOWN status when url changes', function () {
        var page = {};
        page.url = 'New url 1';
        var page0 = pageService.get(0);
        expect(page0.url).not.toBe(page.url);
        page0.tests.forEach(function (test) {
            expect(test.status).not.toBe(statuses.UNKNOWN);
        });
        pageService.edit(page, 0);
        page0 = pageService.get(0);
        expect(page0.url).toBe(page.url);
        page0.tests.forEach(function (test) {
            expect(test.status).toBe(statuses.UNKNOWN);
        });
    });

    it('should allow deletion of pages', function () {
        var page = pageService.get(pageService.getAll().length - 1);
        pageService.remove(page);
        expect(pageService.getAll()).not.toContain(page);
    });
});

describe('PageController', function () {
    beforeEach(module('pigeon.pageController'));
    beforeEach(module('pigeon.pageService'));

    beforeEach(inject(function (_$rootScope_, _pageService_) {
        $rootScope = _$rootScope_;
        pageService = _pageService_;
    }));

    beforeEach(function (done) {
        pageService.init();
        $rootScope.$digest();
        done();
    });

    describe('on adding page', function () {
        beforeEach(inject(function (_$controller_) {
            this.controller = _$controller_('PageController', {$scope: {}, $routeParams: {}, pageService: pageService});
        }));

        it('should has empty model', function () {
            expect(this.controller.page).toBeDefined();
            expect(this.controller.page.description).toBeUndefined();
            expect(this.controller.page.url).toBeUndefined();
        });

        it('should save model', function () {
            this.controller.page.description = 'Add page';
            this.controller.page.url = 'Add url';

            var pages = pageService.getAll();
            expect(pages).not.toContain(this.controller.page);
            this.controller.save();
            expect(pages).toContain(this.controller.page);
            pageService.remove(pages[pages.length - 1]);
        });
    });

    describe('on edition page', function () {
        beforeEach(inject(function (_$controller_) {
            this.pageIndex = 0;
            this.controller = _$controller_('PageController',
                {$scope: {}, $routeParams: {pageIndex: this.pageIndex}, pageService: pageService});
        }));

        it('should load model', function () {
            var pages = pageService.getAll();

            expect(this.controller.page).toBeDefined();
            expect(this.controller.page.description).toBe(pages[this.pageIndex].description);
            expect(this.controller.page.url).toBe(pages[this.pageIndex].url);
        });

        it('should save model', function () {
            this.controller.page.description = 'Edit page';
            this.controller.page.url = 'Edit url';

            var pages = pageService.getAll();
            var page = pageService.get(this.pageIndex);
            expect(page.description).not.toBe(this.controller.page.description);
            expect(page.url).not.toBe(this.controller.page.url);
            this.controller.save();
            page = pageService.get(this.pageIndex);
            expect(page.description).toBe(this.controller.page.description);
            expect(page.url).toBe(this.controller.page.url);
        });
    });
});
