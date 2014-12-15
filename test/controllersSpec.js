describe('Controllers', function() {
 	beforeEach(module('pigeonControllers'));
 	describe('MainController', function() {
		var $controller;

		beforeEach(inject(function(_$controller_){
			$controller = _$controller_;
			var $scope = {};
      		this.controller = $controller('MainController', { $scope: $scope });
		}));

		it('should load pages', function() {
			expect(this.controller.pages).toBe(pigeon.storage.pages);
		});

		describe('countTests', function() {
			it('should count ERROR tests', function() {
				var count = this.controller.countTests(this.controller.pages[0], this.controller.statuses.ERROR);
				expect(count).toBe(2);
			});
			it('should count SUCCESS tests', function() {
				var count = this.controller.countTests(this.controller.pages[0], this.controller.statuses.SUCCESS);
				expect(count).toBe(1);
			});
			it('should count FAILED tests', function() {
				var count = this.controller.countTests(this.controller.pages[0], this.controller.statuses.FAILED);
				expect(count).toBe(1);
			});
		});

		describe('shouldHideTest', function() {
			it('should hide success tests if checkbox is checked', function() {
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

	describe('PageController', function() {
		var $controller;

		describe('on adding page', function() {
			beforeEach(inject(function(_$controller_){
				$controller = _$controller_;
	      		this.controller = _$controller_('PageController', { $scope: {}, $routeParams: {} });
			}));

			it('should has empty model', function() {
				expect(this.controller.page).toBeDefined();
	  			expect(this.controller.page.description).toBeUndefined();
	  			expect(this.controller.page.url).toBeUndefined();
			})

			it('should save model', function() {
				this.controller.page.description = 'Add page';
				this.controller.page.url = 'Add url';

				var pages = pigeon.storage.getPages();
				expect(pages[pages.length-1].description).not.toBe(this.controller.page.description);
				expect(pages[pages.length-1].url).not.toBe(this.controller.page.url);
				this.controller.savePage();
				expect(pages[pages.length-1].description).toBe(this.controller.page.description);
				expect(pages[pages.length-1].url).toBe(this.controller.page.url);
			});
		});

		describe('on edition page', function() {
			beforeEach(inject(function(_$controller_){
				$controller = _$controller_;
				this.pageIndex = 0;
	      		this.controller = _$controller_('PageController', { $scope: {}, $routeParams: {pageIndex: this.pageIndex} });
			}));

			it('should load model', function() {
				var pages = pigeon.storage.getPages();

				expect(this.controller.page).toBeDefined();
	  			expect(this.controller.page.description).toBe(pages[0].description);
	  			expect(this.controller.page.url).toBe(pages[0].url);
			})

			it('should save model', function() {
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

	describe('TestController', function() {
		var $controller;

		describe('on adding page', function() {
			beforeEach(inject(function(_$controller_){
				$controller = _$controller_;
				this.pageIndex = 0;
	      		this.controller = _$controller_('TestController', { $scope: {}, $routeParams: {pageIndex: this.pageIndex} });
			}));

			it('should has empty model', function() {
				expect(this.controller.test).toBeDefined();
	  			expect(this.controller.test.description).toBeUndefined();
	  			expect(this.controller.test.code).toBeUndefined();
			})

			it('should save model', function() {
				this.controller.test.description = 'Add test';
				this.controller.test.code = 'return true;';

				var pages = pigeon.storage.getPages();
				var lastTest = pages[this.pageIndex].tests[pages[this.pageIndex].tests.length-1];
				expect(lastTest.description).not.toBe(this.controller.test.description);
				expect(lastTest.code).not.toBe(this.controller.test.code);
				this.controller.saveTest();
				lastTest = pages[this.pageIndex].tests[pages[this.pageIndex].tests.length-1];
				expect(lastTest.description).toBe(this.controller.test.description);
				expect(lastTest.code).toBe(this.controller.test.code);
			});
		});

		describe('on edition page', function() {
			beforeEach(inject(function(_$controller_){
				$controller = _$controller_;
				this.pageIndex = 0;
				this.testIndex = 0;
	      		this.controller = _$controller_('TestController', { $scope: {}, $routeParams: {pageIndex: this.pageIndex, testIndex: this.testIndex} });
			}));

			it('should load model', function() {
				var pages = pigeon.storage.getPages();

				expect(this.controller.test).toBeDefined();
	  			expect(this.controller.test.description).toBe(pages[this.pageIndex].tests[this.testIndex].description);
	  			expect(this.controller.test.code).toBe(pages[this.pageIndex].tests[this.testIndex].code);
			})

			it('should save model', function() {
				this.controller.test.description = 'Edit test';
				this.controller.test.code = 'return 1 === 1;';

				var pages = pigeon.storage.getPages();
				expect(pages[this.pageIndex].tests[this.testIndex].description).not.toBe(this.controller.test.description);
				expect(pages[this.pageIndex].tests[this.testIndex].code).not.toBe(this.controller.test.code);
				this.controller.saveTest();
				expect(pages[this.pageIndex].tests[this.testIndex].description).toBe(this.controller.test.description);
				expect(pages[this.pageIndex].tests[this.testIndex].code).toBe(this.controller.test.code);
			});
		});
	});
});