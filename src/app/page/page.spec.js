describe('PageController', function () {
    beforeEach(module('pigeon.page'));
    beforeEach(module('pigeon.core'));
    beforeEach(inject(function (_pigeon_) {
        pigeon = _pigeon_;
        pigeon.init();
    }));

    describe('on adding page', function () {
        beforeEach(inject(function (_$controller_) {
            this.controller = _$controller_('PageController', {$scope: {}, $routeParams: {}, pigeon: pigeon});
        }));

        it('should has empty model', function () {
            expect(this.controller.page).toBeDefined();
            expect(this.controller.page.description).toBeUndefined();
            expect(this.controller.page.url).toBeUndefined();
        })

        it('should save model', function () {
            this.controller.page.description = 'Add page';
            this.controller.page.url = 'Add url';

            var pages = pigeon.storage.getPages();
            expect(pages[pages.length - 1].description).not.toBe(this.controller.page.description);
            expect(pages[pages.length - 1].url).not.toBe(this.controller.page.url);
            this.controller.savePage();
            expect(pages[pages.length - 1].description).toBe(this.controller.page.description);
            expect(pages[pages.length - 1].url).toBe(this.controller.page.url);
        });
    });

    describe('on edition page', function () {
        beforeEach(inject(function (_$controller_) {
            this.pageIndex = 0;
            this.controller = _$controller_('PageController',
                {$scope: {}, $routeParams: {pageIndex: this.pageIndex}, pigeon: pigeon});
        }));

        it('should load model', function () {
            var pages = pigeon.storage.getPages();

            expect(this.controller.page).toBeDefined();
            expect(this.controller.page.description).toBe(pages[0].description);
            expect(this.controller.page.url).toBe(pages[0].url);
        })

        it('should save model', function () {
            this.controller.page.description = 'Edit page';
            this.controller.page.url = 'Edit url';

            var pages = pigeon.storage.getPages();
            expect(pages[this.pageIndex].description).not.toBe(this.controller.page.description);
            expect(pages[this.pageIndex].url).not.toBe(this.controller.page.url);
            this.controller.savePage();
            expect(pages[this.pageIndex].description).toBe(this.controller.page.description);
            expect(pages[this.pageIndex].url).toBe(this.controller.page.url);
        });
    });
});
