var pigeonControllers = angular.module('pigeonControllers', []);

// Main Controller
pigeonControllers.controller('MainController', ['$scope', function($scope) {
	this.shouldHideSuccess = false;

	this.pages = pigeon.storage.getPages();
	this.statuses = pigeon.statuses;

	this.statusCssClasses = [];
	this.statusCssClasses[this.statuses.UNKNOWN] = 'status-unknown';
	this.statusCssClasses[this.statuses.SUCCESS] = 'status-success';
	this.statusCssClasses[this.statuses.FAILED] = 'status-failed';
	this.statusCssClasses[this.statuses.ERROR] = 'status-error';

	this.statusNames = [];
	this.statusNames[this.statuses.UNKNOWN] = 'UNKNOWN';
	this.statusNames[this.statuses.SUCCESS] = 'SUCCESS';
	this.statusNames[this.statuses.FAILED] = 'FAILED';
	this.statusNames[this.statuses.ERROR] = 'ERROR';

	this.countTests = function(page, status) {
		var count = 0;
		for (var i = 0; i < page.tests.length; i++) {
			if (page.tests[i].status === status) {
				count++;
			}
		}
		return count;
	}

	this.getStatusCssClass = function(status) {
		return this.statusCssClasses[status];
	};

	this.getStatusName = function(status) {
		return this.statusNames[status];
	};

	this.shouldHideTest = function(test) {
		return (test.status === this.statuses.SUCCESS) && this.shouldHideSuccess;
	};

	this.removeTest = function(test) {
		pigeon.storage.removeTest(test);
	};

	this.removePage = function(page) {
		pigeon.storage.removePage(page);
	};

	this.refreshTest = function(test) {
		test.status = this.statuses.UNKNOWN;
		test.isExecuting = true;
		pigeon.execute(test, this.testCompleteCallback);
	};

	this.refreshPage = function(page) {
		for (var i = 0; i < page.tests.length; i++) {
			this.refreshTest(page.tests[i]);
		}
	};

	this.refreshAll = function() {
		for (var i = 0; i < this.pages.length; i++) {
			this.refreshPage(this.pages[i]);
		}
	};

	this.testCompleteCallback = function(test) {
		test.isExecuting = false;
		$scope.$apply();
	};
} ]);

// Page Controller
pigeonControllers.controller('PageController', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
	this.page = {};
	if (typeof $routeParams.pageIndex !== 'undefined') {
		var editPage = pigeon.storage.getPage($routeParams.pageIndex);
		this.page.description = editPage.description;
		this.page.url = editPage.url;
	}

	this.savePage = function() {
		if (typeof $routeParams.pageIndex === 'undefined') {
			pigeon.storage.addPage(this.page);
		} else {
			pigeon.storage.editPage(this.page, $routeParams.pageIndex);
		}
		
		this.page = {};
		$location.path('/');
	};
} ]);

// Test Controller
pigeonControllers.controller('TestController', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
	this.test = {};
	if (typeof $routeParams.testIndex !== 'undefined') {
		var editTest = pigeon.storage.getTest($routeParams.pageIndex, $routeParams.testIndex);
		this.test.description = editTest.description;
		this.test.code = editTest.code.toString();
	}

	this.saveTest = function() {
		if (typeof $routeParams.testIndex === 'undefined') {
			pigeon.storage.addTest(this.test, $routeParams.pageIndex);
		} else {
			pigeon.storage.editTest(this.test, $routeParams.pageIndex, $routeParams.testIndex);
		}
		
		this.test = {};
		$location.path('/');
	};
} ]);