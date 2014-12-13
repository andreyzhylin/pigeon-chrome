var pigeon = (function() {
	var statuses = {
		UNKNOWN: "UNKNOWN",
		SUCCESS: "SUCCESS",
		FAILED: "FAILED",
		ERROR: "ERROR"
	};

	var GOOGLE_STORAGE_PAGES_KEY = 'PAGES';

	/**
	 * @description
	 * Determines if a reference is boolean.
	 *
	 * @param {*} value Reference to check.
	 * @returns {boolean} True if `value` is boolean.
	 */
	function isBoolean(value) {
		return typeof value === 'boolean';
	}

	/**
	 * @description
	 * Determines if a reference is defined.
	 *
	 * @param {*} value Reference to check.
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
	 * @return {string} Prepared code
	 */
	function prepareCode(code) {
		return '(function() {' + code + '})()';
	}

	/**
	 * @description
	 * Opens chrome tab, executes code, changes status depends on result.
	 *
	 * @param {object} test Test to execute
	 * @param {Function} callback Function to execute after the test
	 */
	var execute = function(test, callback) {
		(function(self) {
			chrome.tabs.create({ url:test.page.url, active: false }, function(tab) {
				chrome.tabs.executeScript(tab.id, { code: prepareCode(test.code) }, function(result) {
					chrome.tabs.remove(tab.id);
					test.status = !isBoolean(result[0]) ? self.statuses.ERROR : 
						result[0] ? self.statuses.SUCCESS : self.statuses.FAILED;
					(callback || self.noop)(test);
				});
			});
		})(this);
	};

	/**
	 * @description
	 * Storage object contains CRUD functions and communicates with Chrome storage API.
	 *
	 * @property {object} storageArea Chrome storage object
	 * @property {array} pages Array of pages
	 */
	var storage = {
		storageArea: chrome.storage.local,
		pages: [],

		/**
		 * @description
		 * Saves pages to google storage.
		 */
		saveData: function() {
			var data = {};
			data[GOOGLE_STORAGE_PAGES_KEY] = JSON.stringify(this.pages, function(key, value) {
				// Pages array has circular structure, we should remove link to pages, to save JSON data
				if (key === 'page') {
					return undefined;
				} else {
					return value;
				}
			});
			this.storageArea.set(data);
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
		 * @param  {number} pageIndex Page index in array
		 * @returns {object} Page object
		 */
		getPage: function(pageIndex) {
			return this.pages[pageIndex];
		},

		/**
		 * @description
		 * Adds page to array and refreshes chrome storage.
		 * 
		 * @param  {object} page Page to add
		 */
		addPage: function(page) {
			this.pages.push(page);
			this.saveData();
		},

		/**
		 * @description
		 * Edits page to array and refreshes chrome storage.
		 * 
		 * @param  {object} page Page to edit
		 * @param  {object} pageIndex Page index in array
		 */
		editPage: function(page, pageIndex) {
			this.pages[pageIndex].description = page.description;
			this.pages[pageIndex].url = page.url;
			this.saveData();
		},

		/**
		 * @description
		 * Removes page to array and refreshes chrome storage.
		 * 
		 * @param  {object} page Page to remove
		 */
		removePage: function(page) {
			var index = this.pages.indexOf(page);
			this.pages.splice(index, 1);
			this.saveData();
		},

		/**
		 * @description
		 * Returns test by index and page index.
		 * 
		 * @param  {number} Page index in array
		 * @param  {number} Test index in page array
		 * @returns {object} Test object
		 */
		getTest: function(pageIndex, testIndex) {
			return this.pages[pageIndex].tests[testIndex];
		},

		/**
		 * @description
		 * Adds test to array and refreshes chrome storage.
		 * 
		 * @param  {object} test Test to add
		 * @param  {number} pageIndex Index of page which test belongs to
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
		 * Edits test to array and refreshes chrome storage
		 * 
		 * @param  {object} test Test to edit
		 * @param  {number} pageIndex Index of page which test belongs to
		 * @param  {number} testIndex Test index in page array
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
		 * @param  {object} test Test to remove
		 */
		removeTest: function(test) {
			var pageIndex = this.pages.indexOf(test.page);
			var testIndex = this.pages[pageIndex].tests.indexOf(test);
			this.pages[pageIndex].tests.splice(testIndex, 1);
			this.saveData();
		}
	};

	// Load pages from chrome storage
	(function(localStorage) {
		localStorage.storageArea.get(GOOGLE_STORAGE_PAGES_KEY, function(data) {
			if (isDefined(data[GOOGLE_STORAGE_PAGES_KEY])) {
				localStorage.pages = JSON.parse(data[GOOGLE_STORAGE_PAGES_KEY]);
				// Return links to pages after load
				for (var i = 0; i < localStorage.pages.length; i++) {
					for (var j = 0; j < localStorage.pages[i].tests.length; j++) {
						localStorage.pages[i].tests[j].page = localStorage.pages[i];
					}
				}
			}
	    });
	})(storage);

	return {
		statuses: statuses,
		storage: storage,
		execute: execute
	};
})();


