var pigeon = (function() {
	var statuses = {
		UNKNOWN: "UNKNOWN",
		SUCCESS: "SUCCESS",
		FAILED: "FAILED",
		ERROR: "ERROR"
	};

	var STORAGE_PAGES_KEY = 'PAGES';
	var CLOSE_PAGE_INTERVAL_TIME = 500;

	var browserService = chromeService;

	/**
	 * @description
	 * Determines if a reference is boolean.
	 *
	 * @param   {*} value Reference to check.
	 * @returns {boolean} True if `value` is boolean.
	 */
	function isBoolean(value) {
		return typeof value === 'boolean';
	}

	/**
	 * @description
	 * Determines if a reference is defined.
	 *
	 * @param   {*} value Reference to check.
	 * @returns {boolean} True if `value` is defined.
	 */
	function isDefined(value) {
		return typeof value !== 'undefined';
	}

	/**
	 * @description
	 * A function that performs no operations.
	 */
	function noop() {}

	/**
	 * @description
	 * Prepares test code to execution.
	 * 
	 * @param  {string} code Code to prepare
	 * @return {string}      Prepared code
	 */
	function prepareCode(code) {
		return '(function() {' + code + '})()';
	}

	/**
	 * @param  {array}   array 
	 * @param  {*} 	     obj   
	 * @return {boolean} 	   Returns `true` if array includes obj, returns `false` otherwise 
	 */
	function includes(array, obj) {
		return Array.prototype.indexOf.call(array, obj) != -1;
	}

	/**
	 * @description
	 * Removes value from array
	 * 
	 * @param  {array} 	array 
	 * @param  {*} 		value 
	 * @return {*} 			  Removed value
	 */
	function arrayRemove(array, value) {
		var index = array.indexOf(value);
		if (index >= 0) {
			array.splice(index, 1);
		}
		return value;
	}

	/**
	 * @description
	 * Helper function that just executes one test
	 *
	 * @param {number}   tabId    Browser tab id
	 * @param {object}   test     Test to execute
	 * @param {Function} callback Callback function
	 */
	var executeOne = function(tabId, test, callback) {
		(function(callback) {
			browserService.executeScript(tabId, prepareCode(test.code), function(result) {
				test.status = !isBoolean(result[0]) ? statuses.ERROR : 
					result[0] ? statuses.SUCCESS : statuses.FAILED;
				test.isExecuting = false;
				(callback || noop)(test);
			});
		})(function(test) {
			storage.saveData();
			(callback || noop)(test);
		});
	};

	/**
	 * @description
	 * Opens browser tab, executes code of specified test, changes status depends on result.
	 *
	 * @param {object}   test     Test to execute
	 * @param {Function} callback Function to execute after the test
	 */
	var executeTest = function(test, callback) {
		if (test.isExecuting) {
			return;
		}
		test.status = this.statuses.UNKNOWN;
		test.isExecuting = true;
		browserService.openPage(test.page.url, function(tabId) {
			executeOne(tabId, test, function() {
				browserService.closePage(tabId);
				(callback || noop)(test);
			});
		});
	};

	/**
	 * @description
	 * Opens browser tab, executes code of all tests, changes status depends on result.
	 *
	 * @param {object}   page     Page to execute
	 * @param {Function} callback Function to execute after the test
	 */
	var executePage = function(page, callback) {
		var isPageAlreadyExecuting = page.tests.every(function(test, index, array) {
			return test.isExecuting;
		});
		if (isPageAlreadyExecuting) {
			return;
		}
		page.tests.forEach(function(test, index, array) {
			test.status = statuses.UNKNOWN;
			test.isExecuting = true;
		});
		browserService.openPage(page.url, function(tabId) {
			page.tests.forEach(function(test, index, array) {
				executeOne(tabId, test, callback);
			});
			var closePageInterval = setInterval(function() {
				var isFinished = page.tests.every(function(test, index, array) {
					return !test.isExecuting;
				});
				if (isFinished) {
					browserService.closePage(tabId);
					clearInterval(closePageInterval);
				}
			}, CLOSE_PAGE_INTERVAL_TIME);
			
		});
	};

	/**
	 * @description
	 * Opens browser tabs for all pages, executes code of all tests, changes status depends on result.
	 *
	 * @param {Function} callback Function to execute after the test
	 */
	var executeAll = function(callback) {
		storage.pages.forEach(function(page, index, array) {
			executePage(page, callback);
		});
	};

	/**
	 * @description
	 * Storage object contains CRUD functions and communicates with browser storage API.
	 *
	 * @property {object} storageArea Browser storage object
	 * @property {array}  pages       Array of pages
	 */
	var storage = {
		pages: [],

		/**
		 * @description
		 * Saves pages to google storage.
		 */
		saveData: function() {
			var data = {};
			data[STORAGE_PAGES_KEY] = JSON.stringify(this.pages, function(key, value) {
				// Pages array has circular structure, we should remove link to pages, to save JSON data
				return key === 'page' ? undefined : value;
			});
			browserService.saveData(data);
		},

		/**
		 * @description
		 * Returns current array of pages.
		 * 
		 * @returns {array} Pages
		 */
		getPages: function() {
			return this.pages;
		},

		/**
		 * @description
		 * Returns page by index.
		 * 
		 * @param   {number} pageIndex Page index in array
		 * @returns {object}           Page object
		 */
		getPage: function(pageIndex) {
			return this.pages[pageIndex];
		},

		/**
		 * @description
		 * Adds page to array and refreshes browser storage.
		 * 
		 * @param {object} page Page to add
		 */
		addPage: function(page) {
			this.pages.push(page);
			this.saveData();
		},

		/**
		 * @description
		 * Edits page to array and refreshes browser storage.
		 * 
		 * @param {object} page      New page data
		 * @param {object} pageIndex Page index in array
		 */
		editPage: function(page, pageIndex) {
			this.pages[pageIndex].description = page.description;
			this.pages[pageIndex].url = page.url;
			this.saveData();
		},

		/**
		 * @description
		 * Removes page to array and refreshes browser storage.
		 * 
		 * @param {object} page Page to remove
		 */
		removePage: function(page) {
			arrayRemove(this.pages, page);
			this.saveData();
		},

		/**
		 * @description
		 * Returns test by index and page index.
		 * 
		 * @param   {number} pageIndex Page index in array
		 * @param   {number} testIndex Test index in page array
		 * @returns {object}           Test object
		 */
		getTest: function(pageIndex, testIndex) {
			return this.pages[pageIndex].tests[testIndex];
		},

		/**
		 * @description
		 * Adds test to array and refreshes browser storage.
		 * 
		 * @param {object} test      Test to add
		 * @param {number} pageIndex Index of page which test belongs to
		 */
		addTest: function(test, pageIndex) {
			test.status = statuses.UNKNOWN;
			test.isExecuting = false;
			test.page = this.pages[pageIndex];
			this.pages[pageIndex].tests.push(test);
			this.saveData();
		},

		/**
		 * @description
		 * Edits test to array and refreshes browser storage
		 * 
		 * @param {object} test      New test data
		 * @param {number} pageIndex Index of page which test belongs to
		 * @param {number} testIndex Test index in page array
		 */
		editTest: function(test, pageIndex, testIndex) {
			this.pages[pageIndex].tests[testIndex].description = test.description;
			if (this.pages[pageIndex].tests[testIndex].code !== test.code) {
				this.pages[pageIndex].tests[testIndex].status = statuses.UNKNOWN;
			}
			this.pages[pageIndex].tests[testIndex].code = test.code;
			this.saveData();
		},

		/**
		 * @description
		 * Removes test
		 * 
		 * @param {object} test Test to remove
		 */
		removeTest: function(test) {
			var pageIndex = this.pages.indexOf(test.page);
			arrayRemove(this.pages[pageIndex].tests, test);
			this.saveData();
		}
	};

	// Load pages from browser storage
	browserService.loadData(STORAGE_PAGES_KEY, function(data) {
		if (isDefined(data[STORAGE_PAGES_KEY])) {
			storage.pages = JSON.parse(data[STORAGE_PAGES_KEY]);
			// Return links to pages after load
			storage.pages.forEach(function(page, index, array) {
				page.tests.forEach(function(test, index, array) {
					test.page = page;
				});
			});
		}
	});

	return {
		statuses: statuses,
		storage: storage,
		executeTest: executeTest,
		executePage: executePage,
		executeAll: executeAll
	};
})();


