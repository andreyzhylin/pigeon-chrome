angular.module('pigeon.chromeService', [])

.factory('chromeService', ['$q', function ($q) {
    var _scripts = [];

    // Messenger will be injected before tests execution
    // Messenger functions are used in tests code
    function Messenger(_extensionId) {
        this.extensionId = _extensionId;
        Messenger.messageType = {
            TEST_CASE: 'TEST_CASE',
            ERROR: 'ERROR',
            RESOLVE: 'RESOLVE'
        };

        /**
         * @description
         * Adds test case.
         *
         * @param {number}  tabId       Id of tab where script are executing (added automatically by browser service)
         * @param {number}  scriptIndex Index of executing script (added automatically by browser service)
         * @param {string}  message     Test case message
         * @param {Boolean} testCase    Testing value
         */
        this.expect = function (tabId, scriptIndex, message, testCase) {
            chrome.runtime.sendMessage(this.extensionId, {
                tabId: tabId,
                scriptIndex: scriptIndex,
                type: Messenger.messageType.TEST_CASE,
                value: testCase,
                message: message
            });
        };

        /**
         * @description
         * Finishes test execution.
         *
         * @param {number} tabId       Id of tab where script are executing (added automatically by browser service)
         * @param {number} scriptIndex Index of executing script (added automatically by browser service)
         */
        this.resolve = function (tabId, scriptIndex) {
            chrome.runtime.sendMessage(this.extensionId, {
                tabId: tabId,
                scriptIndex: scriptIndex,
                type: Messenger.messageType.RESOLVE
            });
        };

        /**
         * @description
         * Aborts test execution.
         *
         * @param {number} tabId       Id of tab where script are executing (added automatically by browser service)
         * @param {number} scriptIndex Index of executing script (added automatically by browser service)
         * @param {string} message     Error message
         */
        this.reject = function (tabId, scriptIndex, message) {
            chrome.runtime.sendMessage(this.extensionId, {
                tabId: tabId,
                scriptIndex: scriptIndex,
                type: Messenger.messageType.ERROR,
                message: message
            });
        };
    }

    // to init messageTypes
    new Messenger();

    // Listen to messages from executing scripts with test case results
    chrome.runtime.onMessage.addListener(function (request) {
        switch (request.type) {
        case Messenger.messageType.TEST_CASE:
            _scripts[request.tabId][request.scriptIndex].testCases.push(
                {value: request.value, message: request.message}
            );
            break;
        case Messenger.messageType.ERROR:
            _scripts[request.tabId][request.scriptIndex].deferred.reject({message: request.message});
            break;
        case Messenger.messageType.RESOLVE:
            // FIXME: sometimes array element undefined
            var testCases = _scripts[request.tabId][request.scriptIndex].testCases;
            _scripts[request.tabId][request.scriptIndex].deferred.resolve(testCases);
            break;
        default:
            break;
        }
    });

    /**
     * @description
     * Adds scripts indexes to messenger functions
     *
     * @param  {string} code        User code
     * @param  {string} tabId       Id of tab where script are executing
     * @param  {number} scriptIndex Index of executing script
     * @return {string} Prepared code
     */
    var _prepareMessengerFunctions = function (code, tabId, scriptIndex) {
        // TODO: unsafe, should be refactored
        var preparedCode = code.split('pigeon.expect(').join('pigeon.expect(' + tabId + ', ' + scriptIndex + ', ');
        preparedCode = preparedCode.split('pigeon.resolve(').join('pigeon.resolve(' + tabId + ', ' + scriptIndex);
        preparedCode = preparedCode.split('pigeon.reject(').join('pigeon.reject(' + tabId + ', ' + scriptIndex + ', ');
        return preparedCode;
    };

    /**
     * @description
     * Executes messenger and user file codes on specified tab.
     * Inits testcases array on this tab.
     *
     * @param {string} tabId     Tab id
     * @param {string} filesCode Code of user files
     */
    var _executeServiceCode = function (tabId, filesCode) {
        var deferred = $q.defer();
        var messengerCode = 'var pigeon = new (' + Messenger + ')("' + chrome.runtime.id + '"); \n';
        _scripts[tabId] = [];
        chrome.tabs.executeScript(tabId, {code: messengerCode + filesCode}, function () {
            deferred.resolve();
        });
        return deferred.promise;
    };

    return {
        /**
         * @description
         * Opens chrome tab.
         *
         * @param  {string}  url         Page url
         * @param  {string}  filesCode   Code of user files
         * @param  {Boolean} isNewWindow `true` if should open tab in new window
         * @return {object}  $q promise with tab id
         */
        openPage: function (url, filesCode, isNewWindow) {
            var deferred = $q.defer();

            if (isNewWindow) {
                chrome.windows.create({url: url, focused: false}, function (window) {
                    _executeServiceCode(window.tabs[0].id, filesCode).then(function () {
                        deferred.resolve(window.tabs[0].id);
                    });

                });
            } else {
                chrome.tabs.create({url: url, active: false}, function (tab) {
                    _executeServiceCode(tab.id, filesCode).then(function () {
                        deferred.resolve(tab.id);
                    });
                });
            }

            return deferred.promise;
        },

        /**
         * @description
         * Closes chrome tab.
         * Removes testcases array on this tab.
         *
         * @param {number} tabId Tab id
         */
        closePage: function (tabId) {
            chrome.tabs.remove(tabId);
            delete _scripts[tabId];
        },

        /**
         * @description
         * Executes script on specifed chrome tab.
         *
         * @param  {string}  tabId   Id of tab where should execute script
         * @param  {string}  code    Code to execute
         * @param  {number}  timeout After timeout (ms) should interrupt execution (if not debug)
         * @param  {Boolean} isDebug `true` if test should be execute in debug mode (without timeout)
         * @return {object}  $q promise (resolved in onMessage listener)
         */
        executeScript: function (tabId, code, timeout, isDebug) {
            var deferred = $q.defer();

            var scriptIndex = _scripts[tabId].push({deferred: deferred, testCases: []}) - 1;
            code = _prepareMessengerFunctions(code, tabId, scriptIndex);
            chrome.tabs.executeScript(tabId, {code: code}, function () {
                if (!isDebug) {
                    setTimeout(function () {
                        deferred.reject({message: 'TIMEOUT'});
                    }, timeout);
                }
            });

            return deferred.promise;
        },

        /**
         * @description
         * Saves data to chrome storage.
         *
         * @param {string} key   Storage array key
         * @param {string} value Data to store
         */
        saveData: function (key, value) {
            var data = {};
            data[key] = value;
            chrome.storage.local.set(data);
        },

        /**
         * @description
         * Loads data from chrome storage.
         *
         * @param  {string} key Key of searched data
         * @return {object} $q promise with data
         */
        loadData: function (key) {
            var deferred = $q.defer();

            chrome.storage.local.get(key, function (data) {
                deferred.resolve(data);
            });

            return deferred.promise;
        }
    };
}])

;
