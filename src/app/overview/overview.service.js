angular.module('pigeon.overviewService', [
    'pigeon.chromeService',
    'pigeon.pageService',

    'pigeon.statuses',
    'pigeon.methods',

    'pascalprecht.translate',
])

.factory('overviewService', ['$q', '$translate', 'chromeService', 'pageService', 'statuses', 'methods',
    function ($q, $translate, chromeService, pageService, statuses, methods) {
        var _browserService = chromeService;

        /**
         * @description
         * Prepares test code before execution.
         *
         * @param  {string} code Code to prepare
         * @return {string} Prepared code
         */
        var _prepareCode = function (code) {
            return '(function() { try {' +
                code +
            '} catch(e) {' +
            'return {value: undefined, errorMessage: e.message};' +
            '}})()';
        };

        /**
         * @description
         * Prepares result of test execution.
         *
         * @param  {object|string} result Result to prepare
         * @return {object} Prepared result
         */
        var _prepareResult = function (result) {
            return angular.isObject(result) ? result : {value: result, errorMessage: ''};
        };

        /**
         * @description
         * Returns status based on test execution result.
         *
         * @param  {*}      result Result of test execution
         * @return {string} Test status
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
         * Performs operations before test execution.
         *
         * @param {object} test Test to execute
         */
        var _initExecution = function (test) {
            test.status = statuses.UNKNOWN;
            test.isExecuting = true;
        };

        /**
         * @description
         * Performs operations after test execution.
         *
         * @param {object} test   Executed test
         * @param {object} result Result of execution
         */
        var _completeExecution = function (test, result) {
            test.isExecuting = false;
            test.status = _determineStatus(result.value);
            test.errorMessage = result.errorMessage;
            if (test.status === statuses.ERROR && test.errorMessage === '') {
                test.errorMessage = $translate.instant('ERROR_NOT_BOOLEAN') + '\'' + result.value + '\'';
            }
        };

        /**
         * @param  {object}  page Page object
         * @return {Boolean} Returns whether all tests have been completed on the page
         */
        var _isPageExecuting = function (page) {
            var isPageExecuting = page.tests.every(function (test) {
                return test.isExecuting;
            });
            return isPageExecuting;
        };

        /**
         * @param  {object}  page Page object
         * @return {Boolean} Returns true if some tests should be executed on tab
         */
        var _hasPageOnTabScripts = function (page) {
            var hasPageOnTabScripts = page.tests.some(function (test) {
                return test.method === methods.OPEN_TAB;
            });
            return hasPageOnTabScripts;
        };

        /**
         * @description
         * Executes one test on browser tab.
         *
         * @param  {number} tabId Browser tab id
         * @param  {object} test  Test to execute
         * @return (object) $q promise
         */
        var _executeScript = function (tabId, test) {
            var deferred = $q.defer();
            _browserService.executeScript(tabId, _prepareCode(test.code)).then(function (result) {
                _completeExecution(test, _prepareResult(result[0]));
                deferred.resolve(test);
            });
            return deferred.promise;
        };

        /**
         * @description
         * Executes one test that has GET request or POST request method.
         *
         * @param  {object} test Test to execute
         * @return {object} $q promise
         */
        var _executeRequest = function (test) {
            var deferred = $q.defer();
            var request = new XMLHttpRequest();
            request.onreadystatechange = function () {
                if (request.readyState == 4) {
                    if (request.status == 200) {
                        var response = JSON.stringify(request.responseText);
                        var code = 'var response = ' + response + ';' + test.code;
                        _browserService.executeRequest(_prepareCode(code)).then(function (result) {
                            _completeExecution(test, _prepareResult(result));
                            deferred.resolve(test);
                        });
                    } else {
                        var errorMessage = request.status === 0 ? $translate.instant('ERROR_URL_NOT_FOUND') :
                            $translate.instant('ERROR_REQUEST_STATUS') +
                            request.status +
                            ' (' + request.statusText + ')';
                        _completeExecution(test, {value: undefined, errorMessage: errorMessage});
                        deferred.resolve(test);
                    }
                }
            };

            var paramsStr = '';
            if (angular.isDefined(test.params)) {
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
            return deferred.promise;
        };

        var pigeon = {
            /**
             * @description
             * Inits and executes test (script or request)
             *
             * @param  {object} test Test to execute
             * @return {object} $q promise
             */
            executeTest: function (test) {
                var deferred = $q.defer();
                if (test.isExecuting) {
                    deferred.reject();
                }
                _initExecution(test);
                if (test.method === methods.OPEN_TAB) {
                    _browserService.openPage(test.page.url).then(function (tabId) {
                        _executeScript(tabId, test).then(function (test) {
                            _browserService.closePage(tabId);
                            deferred.resolve(test);
                        });
                    });
                } else {
                    _executeRequest(test).then(function (test) {
                        deferred.resolve(test);
                    });
                }
                return deferred.promise.then(function () {
                    pageService.save();
                    return true;
                });
            },

            /**
             * @description
             * Executes all tests on page.
             *
             * @param  {object} page Page to execute
             * @return {object} $q promise
             */
            executePage: function (page) {
                var requestPromises = [];
                var scriptPromises = [];
                if (_isPageExecuting(page)) {
                    return $q.defer().reject();
                }
                angular.forEach(page.tests, function (test) {
                    _initExecution(test);
                    if (test.method !== methods.OPEN_TAB) {
                        requestPromises.push(_executeRequest(test));
                    }
                });
                var scriptsCompleted = $q.defer();
                if (_hasPageOnTabScripts(page)) {
                    _browserService.openPage(page.url).then(function (tabId) {
                        angular.forEach(page.tests, function (test) {
                            if (test.method === methods.OPEN_TAB) {
                                scriptPromises.push(_executeScript(tabId, test));
                            }
                        });
                        $q.all(scriptPromises).then(function () {
                            _browserService.closePage(tabId);
                            scriptsCompleted.resolve();
                        });
                    });
                } else {
                    scriptsCompleted.resolve();
                }
                return $q.all(requestPromises.concat(scriptsCompleted.promise)).then(function () {
                    pageService.save();
                    return true;
                });
            },

            /**
             * @description
             * Executes all tests on specified pages
             *
             * @param  {array}  pages Array of pages to execute
             * @return {object} $q promise
             */
            executeAll: function (pages) {
                var promises = [];
                angular.forEach(pages, function (page) {
                    promises.push(pigeon.executePage(page));
                });
                return $q.all(promises).then(function () {
                    pageService.save();
                    return true;
                });
            }
        };
        return pigeon;
    }
])

;
