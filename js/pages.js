(function() {
	var app = angular.module('pigeon-pages', []);

	app.directive('pageForm', function() {
		return {
			restrict: 'E',
			templateUrl: 'templates/page-form.html',
			controller: function() {
				this.page = {};

				this.addPage = function() {
					// TODO
					if (this.page.description === undefined ||
						this.page.description == '') {
						this.page.description = this.page.url;
					}
					if (!/^https?:\/\//i.test(this.page.url)) {
					    this.page.url = 'http://' + this.page.url;
					}
					this.page.tests = [];
					window.pages.push(this.page);
					this.page = {};
				};
			},
			controllerAs: 'pageCtrl'
		}
	})
})();