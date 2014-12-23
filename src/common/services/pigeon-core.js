angular.module('pigeon.core', ['pigeon.chromeService', 'pascalprecht.translate'])

.factory('pigeon', ['chromeService', '$translate', '$q', function (chromeService, $translate, $q) {
    var statuses = {
        UNKNOWN: 'UNKNOWN',
        SUCCESS: 'SUCCESS',
        FAILED: 'FAILED',
        ERROR: 'ERROR'
    };

    var methods = {
        OPEN_TAB: 'OPEN_TAB',
        GET_REQUEST: 'GET_REQUEST',
        POST_REQUEST: 'POST_REQUEST'
    };

    var options = {
        SANDBOX_FRAME_ID: 'sandboxFrame'
    };

    var STORAGE_PAGES_KEY = 'PAGES';
    var CLOSE_PAGE_INTERVAL_TIME = 500;

    var _browserService = chromeService;

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
     * Determines if a reference is object.
     *
     * @param   {*} value Reference to check.
     * @returns {boolean} True if `value` is object.
     */
    function isObject(value) {
        return typeof value === 'object' && value !== null;
    }

    /**
     * @description
     * A function that performs no operations.
     */
    function noop() {}

    /**
     * @param  {array} array
     * @param  {*}     obj
     * @return {boolean} Returns `true` if array includes obj, returns `false` otherwise
     */
    function includes(array, obj) {
        return Array.prototype.indexOf.call(array, obj) != -1;
    }

    /**
     * @description
     * Removes value from array
     *
     * @param  {array} array
     * @param  {*}     value
     * @return {*} Removed value
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
     * Prepares test code to execution.
     *
     * @param  {string} code Code to prepare
     * @return {string}      Prepared code
     */
    var _prepareCode = function (code) {
        return '(function() { try {' + code + '} catch(e) {return {value: undefined, errorMessage: e.message};}})()';
    };

    /**
     * @description
     * Prepares result of test execution.
     *
     * @param  {*} result Result to prepare
     * @return {object}   Prepared result
     */
    var _prepareResult = function (result) {
        return isObject(result) ? result : {value: result, errorMessage: ''};
    };

    /**
     * @description
     * Returns status based on return value of script
     *
     * @param  {*}      result Result of test script
     * @return {string}        Test status
     */
    var _determineStatus = function (result) {
        if (result === true) {
            return statuses.SUCCESS;
        } else if (result === false) {
            return statuses.FAILED;
        } else {
            return statuses.ERROR;
        }
    };

    /**
     * @description
     * Performs operations before test execution
     *
     * @param {object} test Test to execute
     */
    var _initExecution = function (test) {
        test.status = statuses.UNKNOWN;
        test.isExecuting = true;
    };

    /**
     * @description
     * Performs operations after test execution
     *
     * @param  {object}   test     Executed test
     * @param  {*}        result   Result of execution
     * @param  {Function} callback Callback after execution
     */
    var _completeExecution = function (test, result, callback) {
        test.status = _determineStatus(result.value);
        test.errorMessage = test.status === statuses.ERROR && result.errorMessage === '' ?
            $translate.instant('ERROR_NOT_BOOLEAN') + '\'' + result.value + '\'' : result.errorMessage;
        test.isExecuting = false;
        storage.saveData();
        (callback || noop)(test);
    };

    /**
     * @param  {object}  page Page object
     * @return {Boolean}      Returns whether all tests have been completed on the page
     */
    var _isPageExecuting = function (page) {
        var isPageExecuting = page.tests.every(function (test) {
            return test.isExecuting;
        });
        return isPageExecuting;
    };

    /**
     * @param  {object}  page Page object
     * @return {Boolean}      Returns true if some tests should be executed on tab
     */
    var _hasPageOnTabScripts = function (page) {
        var hasPageOnTabScripts = page.tests.some(function (test) {
            return test.method === methods.OPEN_TAB;
        });
        return hasPageOnTabScripts;
    };

    /**
     * @description
     * Close page after all tests are completed
     *
     * @param {object} page  Page to check tests
     * @param {string} tabId Id of tab to close
     */
    var _closePage = function (page, tabId) {
        var closePageInterval = setInterval(function () {
            var isFinished = page.tests.every(function (test) {
                return test.method !== methods.OPEN_TAB || !test.isExecuting;
            });
            if (isFinished) {
                _browserService.closePage(tabId);
                clearInterval(closePageInterval);
            }
        }, CLOSE_PAGE_INTERVAL_TIME);
    };

    /**
     * @description
     * Helper function that just executes one test on browser tab
     *
     * @param {number}   tabId    Browser tab id
     * @param {object}   test     Test to execute
     * @param {Function} callback Callback function
     */
    var _executeScript = function (tabId, test, callback) {
        _browserService.executeScript(tabId, _prepareCode(test.code), function (result) {
            _completeExecution(test, _prepareResult(result[0]), callback);
        });
    };

    /**
     * @description
     * Helper function that executes one test that has GET request or type request method
     *
     * @param  {object}   test     Test to execute
     * @param  {Function} callback Callback function
     */
    var _executeRequest = function (test, callback) {
        var request = new XMLHttpRequest();
        request.onreadystatechange = function () {
            if (request.readyState == 4) {
                if (request.status == 200) {
                    var response = JSON.stringify(request.responseText);
                    var code = 'var response = ' + response + ';' + test.code;
                    _browserService.executeRequest(_prepareCode(code), options.SANDBOX_FRAME_ID, function (result) {
                        _completeExecution(test, _prepareResult(result), callback);
                    });
                } else {
                    var errorMessage = request.status === 0 ? $translate.instant('ERROR_URL_NOT_FOUND') :
                        $translate.instant('ERROR_REQUEST_STATUS') + request.status + ' (' + request.statusText + ')';
                    _completeExecution(test, {value: undefined, errorMessage: errorMessage}, callback);
                }
            }
        };

        var paramsStr = '';
        if (isDefined(test.params)) {
            test.params.forEach(function (param) {
                paramsStr += param.key + '=' + encodeURIComponent(param.value) + '&';
            });
        }

        if (test.method === methods.GET_REQUEST) {
            request.open('GET', test.page.url + '?' + paramsStr, true);
            request.send(null);
        } else if (test.method === methods.POST_REQUEST) {
            request.open('POST', test.page.url, true);
            request.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
            request.send(paramsStr);
        }
    };

    /**
     * @description
     * Opens browser tab, executes code of specified test, changes status depends on result.
     *
     * @param {object}   test     Test to execute
     * @param {Function} callback Function to execute after the test
     */
    var executeTest = function (test, callback) {
        if (test.isExecuting) {
            return;
        }
        _initExecution(test);
        if (test.method === methods.OPEN_TAB) {
            _browserService.openPage(test.page.url, function (tabId) {
                _executeScript(tabId, test, function () {
                    _closePage(test.page, tabId);
                    (callback || noop)(test);
                });
            });
        } else {
            _executeRequest(test, callback);
        }
    };

    /**
     * @description
     * Opens browser tab, executes code of all tests, changes status depends on result.
     *
     * @param {object}   page     Page to execute
     * @param {Function} callback Function to execute after the test
     */
    var executePage = function (page, callback) {
        if (_isPageExecuting(page)) {
            return;
        }
        page.tests.forEach(function (test) {
            _initExecution(test);
            if (test.method !== methods.OPEN_TAB) {
                _executeRequest(test, callback);
            }
        });

        if (_hasPageOnTabScripts(page)) {
            _browserService.openPage(page.url, function (tabId) {
                page.tests.forEach(function (test) {
                    if (test.method === methods.OPEN_TAB) {
                        _executeScript(tabId, test, callback);
                    }
                });
                _closePage(page, tabId);
            });
        }
    };

    /**
     * @description
     * Opens browser tabs for all pages, executes code of all tests, changes status depends on result.
     *
     * @param {Function} callback Function to execute after the test
     */
    var executeAll = function (callback) {
        storage.pages.forEach(function (page) {
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
        saveData: function () {
            var data = {};
            data[STORAGE_PAGES_KEY] = JSON.stringify(this.pages, function (key, value) {
                // Pages array has circular structure, we should remove link to pages, to save JSON data
                return key === 'page' ? undefined : value;
            });
            _browserService.saveData(data);
        },

        /**
         * @description
         * Returns current array of pages.
         *
         * @returns {array} Pages
         */
        getPages: function () {
            return this.pages;
        },

        /**
         * @description
         * Returns page by index.
         *
         * @param   {number} pageIndex Page index in array
         * @returns {object}           Page object
         */
        getPage: function (pageIndex) {
            return this.pages[pageIndex];
        },

        /**
         * @description
         * Adds page to array and refreshes browser storage.
         *
         * @param {object} page Page to add
         */
        addPage: function (page) {
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
        editPage: function (page, pageIndex) {
            if (this.pages[pageIndex].url !== page.url && isDefined(this.pages[pageIndex].tests)) {
                this.pages[pageIndex].tests.forEach(function (test) {
                    test.status = statuses.UNKNOWN;
                });
            }

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
        removePage: function (page) {
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
        getTest: function (pageIndex, testIndex) {
            return this.pages[pageIndex].tests[testIndex];
        },

        /**
         * @description
         * Adds test to array and refreshes browser storage.
         *
         * @param {object} test      Test to add
         * @param {number} pageIndex Index of page which test belongs to
         */
        addTest: function (test, pageIndex) {
            test.status = statuses.UNKNOWN;
            test.isExecuting = false;
            test.page = this.pages[pageIndex];
            if (!isDefined(this.pages[pageIndex].tests)) {
                this.pages[pageIndex].tests = [];
            }
            var params = [];
            if (isDefined(test.params)) {
                test.params.forEach(function (param) {
                    if (param.key !== '' && param.value !== '') {
                        params.push(param);
                    }
                });
            }
            test.params = params;
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
        editTest: function (test, pageIndex, testIndex) {
            var oldTest = this.pages[pageIndex].tests[testIndex];
            oldTest.description = test.description;
            if (oldTest.code !== test.code || oldTest.method !== test.method) {
                oldTest.status = statuses.UNKNOWN;
            }
            oldTest.method = test.method;
            oldTest.code = test.code;
            oldTest.params = [];
            if (isDefined(test.params)) {
                test.params.forEach(function (param) {
                    if (param.key !== '' && param.value !== '') {
                        oldTest.params.push(param);
                    }
                });
            }
            this.saveData();
        },

        /**
         * @description
         * Removes test
         *
         * @param {object} test Test to remove
         */
        removeTest: function (test) {
            var pageIndex = this.pages.indexOf(test.page);
            arrayRemove(this.pages[pageIndex].tests, test);
            this.saveData();
        }
    };

    /**
     * @description
     * Loads data from browser storage
     */
    var init = function () {
        var deferred = $q.defer();
        _browserService.loadData(STORAGE_PAGES_KEY, function (data) {
            if (isDefined(data[STORAGE_PAGES_KEY])) {
                storage.pages = JSON.parse(data[STORAGE_PAGES_KEY]);
                // Return links to pages after load and reset isExecuting
                storage.pages.forEach(function (page) {
                    if (isDefined(page.tests)) {
                        page.tests.forEach(function (test) {
                            test.page = page;
                            test.isExecuting = false;
                        });
                    }
                });
            }
            deferred.resolve();
        });
        return deferred.promise;
    };

    return {
        statuses: statuses,
        methods: methods,
        options: options,
        storage: storage,
        init: init,
        executeTest: executeTest,
        executePage: executePage,
        executeAll: executeAll
    };

}])

;
