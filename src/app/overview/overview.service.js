angular.module('pigeon.overviewService', [
    'pigeon.chromeService',
    'pigeon.pageService',
    'pigeon.fileService',

    'pigeon.statuses',

    'pascalprecht.translate',
])

.factory('overviewService', ['$q', '$translate', 'chromeService', 'pageService', 'fileService', 'statuses',
    function ($q, $translate, chromeService, pageService, fileService, statuses) {
        var _browserService = chromeService;

        /**
         * @description
         * Prepares test code before execution.
         *
         * @param  {string} code Code to prepare
         * @return {string} Prepared code
         */
        var _prepareCode = function (code) {
            // escape quotes
            code = code.replace(/'/g, '\\\'');
            // remove comments
            code = code.replace(/(\/\*([\s\S]*?)\*\/)|(\/\/(.*)$)/gm, '');
            // fix endlines
            code = code.replace(/(\n(\r)?)/g, '\' + \n\'');
            return 'try { ' +
                'eval(\'' + code + '\'); ' +
            '} catch(e) { ' +
                'pigeon.reject(e.message); ' +
            '}';
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
         * @description
         * Opens page and executes specified tests on it
         *
         * @param  {object[]} tests Tests to execute
         * @param  {object}   page  Page where tests should be executed
         * @return {object} $q defer
         */
        var _executeTests = function (tests, page) {
            var deferred = $q.defer();

            var filesCode = '';
            angular.forEach(fileService.getAll(), function (file) {
                filesCode += file.code + ' \n';
            });

            _browserService.openPage(page.url, filesCode, page.isNewWindow).then(function (tabId) {
                var scriptPromises = [];
                angular.forEach(tests, function (test) {
                    scriptPromises.push(_executeScript(tabId, test));
                });
                var isDebug = tests.some(function (test) {
                    return test.isDebug;
                });
                $q.all(scriptPromises).then(function () {
                    if (!isDebug) {
                        _browserService.closePage(tabId);
                    }
                    deferred.resolve();
                });

            });
            return deferred.promise;
        };

        /**
         * @description
         * Executes specified test on browser tab.
         *
         * @param  {number} tabId Browser tab id
         * @param  {object} test  Test to execute
         * @return (object) $q promise
         */
        var _executeScript = function (tabId, test) {
            var deferred = $q.defer();
            _browserService.executeScript(tabId, _prepareCode(test.code), test.isDebug)
                .then(function (testCases) {
                    test.isExecuting = false;
                    test.status = statuses.SUCCESS;
                    test.errorMessage = '';
                    angular.forEach(testCases, function (testCase) {
                        if (testCase.value === false) {
                            test.status = statuses.FAILED;
                            test.errorMessage += testCase.message + '; ';
                        } else if (testCase.value !== true) {
                            test.status = statuses.ERROR;
                            test.errorMessage = $translate.instant('ERROR_NOT_BOOLEAN',
                                {value: '\'' + testCase.value + '\''}
                            );
                        }
                    });
                    deferred.resolve(test);
                }, function (error) {
                    test.isExecuting = false;
                    test.status = statuses.ERROR;
                    test.errorMessage = error.message;
                    deferred.resolve(test);
                });
            return deferred.promise;
        };

        var service = {
            /**
             * @description
             * Inits and executes test
             *
             * @param  {object} test Test to execute
             * @return {object} $q promise
             */
            executeTest: function (test) {
                if (test.isExecuting) {
                    return $q.defer().reject();
                }

                _initExecution(test);

                return _executeTests([test], test.page).then(function () {
                    pageService.save();
                    return true;
                });
            },

            /**
             * @description
             * Executes all tests on page.
             *
             * @param  {object}  page        Page to execute
             * @param  {Boolean} onlySuccess `true` if should execute only unsuccessfull tests
             * @return {object}  $q promise
             */
            executePage: function (page, onlySuccess) {
                if (_isPageExecuting(page)) {
                    return $q.defer().reject();
                }

                var tests = [];
                angular.forEach(page.tests, function (test) {
                    if (!onlySuccess || test.status !== statuses.SUCCESS) {
                        _initExecution(test);
                        tests.push(test);
                    }
                });

                return _executeTests(tests, page).then(function () {
                    pageService.save();
                    return true;
                });
            },

            /**
             * @description
             * Executes all tests on specified pages
             *
             * @param  {array}   pages       Array of pages to execute
             * @param  {Boolean} onlySuccess `true` if should execute only unsuccessfull tests
             * @return {object}  $q promise
             */
            executeAll: function (pages, onlySuccess) {
                var promises = [];
                angular.forEach(pages, function (page) {
                    promises.push(service.executePage(page, onlySuccess));
                });

                return $q.all(promises).then(function () {
                    pageService.save();
                    return true;
                });
            }
        };
        return service;
    }
])

;
