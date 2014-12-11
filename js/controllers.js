var pigeonControllers = angular.module('pigeonControllers', []);

// Main Controller
pigeonControllers.controller('MainController', ['$scope', function($scope) {
	this.shouldHideSuccess = false;

	this.pages = pigeon.storage.getPages();

	this.STATUS_UNKNOWN = pigeon.STATUS_UNKNOWN;
	this.STATUS_SUCCESS = pigeon.STATUS_SUCCESS;
	this.STATUS_FAILED = pigeon.STATUS_FAILED;
	this.STATUS_ERROR = pigeon.STATUS_ERROR;

	this.statusCssClasses = [];
	this.statusCssClasses[this.STATUS_UNKNOWN] = 'status-unknown';
	this.statusCssClasses[this.STATUS_SUCCESS] = 'status-success';
	this.statusCssClasses[this.STATUS_FAILED] = 'status-failed';
	this.statusCssClasses[this.STATUS_ERROR] = 'status-error';

	this.statusNames = [];
	this.statusNames[this.STATUS_UNKNOWN] = 'UNKNOWN';
	this.statusNames[this.STATUS_SUCCESS] = 'SUCCESS';
	this.statusNames[this.STATUS_FAILED] = 'FAILED';
	this.statusNames[this.STATUS_ERROR] = 'ERROR';

	this.getStatusCssClass = function(status) {
		return this.statusCssClasses[status];
	}

	this.getStatusName = function(status) {
		return this.statusNames[status];
	}

	this.shouldHideTest = function(test) {
		return (test.status === this.STATUS_SUCCESS) && this.shouldHideSuccess;
	}

	this.refreshTest = function(test) {
		test.status = this.STATUS_UNKNOWN;
		test.isExecuting = true;
		test.execute(this.testCompleteCallback);
	}

	this.refreshPage = function(page) {
		for (var i = 0; i < page.tests.length; i++) {
			this.refreshTest(page.tests[i]);
		}
	}

	this.refreshAll = function() {
		for (var i = 0; i < this.pages.length; i++) {
			this.refreshPage(this.pages[i]);
		}
	}

	this.testCompleteCallback = function(test) {
		test.isExecuting = false;
		$scope.$apply();
	};
} ]);

// Page Controller
pigeonControllers.controller('PageController', function() {
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
		pigeon.storage.addPage(this.page);
		this.page = {};
	};
});