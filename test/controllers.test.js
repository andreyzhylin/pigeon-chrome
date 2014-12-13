describe('Controllers', function() {

 	beforeEach(module('pigeonControllers'));
 	describe('MainController', function() {
		var $controller;

		beforeEach(inject(function(_$controller_){
			// The injector unwraps the underscores (_) from around the parameter names when matching
			$controller = _$controller_;
			var $scope = {};
      		this.controller = $controller('MainController', { $scope: $scope });
		}));

		it('loads pages', function() {
			expect(this.controller.pages).toBe(pigeon.storage.pages);
		});

		describe('countTests', function() {
			it('correctly counts ERROR tests', function() {
				var count = this.controller.countTests(this.controller.pages[0], this.controller.statuses.ERROR);
				expect(count).toBe(1);
			});
			it('correctly counts SUCCESS tests', function() {
				var count = this.controller.countTests(this.controller.pages[0], this.controller.statuses.SUCCESS);
				expect(count).toBe(0);
			});
			it('correctly counts FAILED tests', function() {
				var count = this.controller.countTests(this.controller.pages[0], this.controller.statuses.FAILED);
				expect(count).toBe(0);
			});
		});

		describe('shouldHideTest', function() {
			it('hide success tests if checked', function() {
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
});