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
		angular.forEach(page.tests, function(test, index) {
			if (test.status === status) {
				count++;
			}
		});
		return count;
	};

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
		pigeon.executeTest(test, this.testCompleteCallback);
	};

	this.refreshPage = function(page) {
		pigeon.executePage(page, this.testCompleteCallback);
	};

	this.refreshAll = function() {
		pigeon.executeAll(this.testCompleteCallback);
	};

	this.testCompleteCallback = function(test) {
		$scope.$apply();
	};
} ]);

// Page Controller
pigeonControllers.controller('PageController', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
	this.page = {};
	if (angular.isDefined($routeParams.pageIndex)) {
		this.page = angular.copy(pigeon.storage.getPage($routeParams.pageIndex));
	}

	this.savePage = function() {
		if (angular.isDefined($routeParams.pageIndex)) {
			pigeon.storage.editPage(this.page, $routeParams.pageIndex);
		} else {
			pigeon.storage.addPage(this.page);
		}
		$location.path('/');
	};
} ]);

// Test Controller
pigeonControllers.controller('TestController', ['$scope', '$routeParams', '$location', function($scope, $routeParams, $location) {
	this.test = {};
	if (angular.isDefined($routeParams.testIndex)) {
		this.test = angular.copy(pigeon.storage.getTest($routeParams.pageIndex, $routeParams.testIndex));	
	}

	this.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        mode: 'javascript',
        theme: 'elegant'
    };

	this.saveTest = function() {
		if (angular.isDefined($routeParams.testIndex)) {
			pigeon.storage.editTest(this.test, $routeParams.pageIndex, $routeParams.testIndex);
		} else {
			pigeon.storage.addTest(this.test, $routeParams.pageIndex);
		}
		$location.path('/');
	};
} ]);