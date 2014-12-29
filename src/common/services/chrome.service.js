angular.module('pigeon.chromeService', [])

.factory('chromeService', ['$q', '$rootScope', function ($q, $rootScope) {
    return {
        /**
         * @description
         * Opens chrome tab.
         *
         * @param  {string} url Page url
         * @return {object} $q promise
         */
        openPage: function (url) {
            var deferred = $q.defer();
            chrome.tabs.create({url:url, active: false}, function (tab) {
                deferred.resolve(tab.id);
            });
            return deferred.promise;
        },

        /**
         * @description
         * Closes chrome tab.
         *
         * @param {number} tabId Tab id
         */
        closePage: function (tabId) {
            chrome.tabs.remove(tabId);
        },

        /**
         * @description
         * Executes script on specifed chrome tab.
         *
         * @param  {string} tabId Id of tab where should execute script
         * @param  {string} code  Code to execute
         * @return {object} $q promise
         */
        executeScript: function (tabId, code) {
            var deferred = $q.defer();
            chrome.tabs.executeScript(tabId, {code: code}, function (result) {
                deferred.resolve(result);
            });
            return deferred.promise;
        },
        /**
         * @description
         * Executes request with test code in sandbox.
         *
         * @param  {string} code Code to execute
         * @return {object} $q promise
         */
        executeRequest: function (code) {
            var deferred = $q.defer();
            var window = chrome.extension.getViews({type: 'tab'})[0];
            var iframe = window.document.getElementById($rootScope.SANDBOX_FRAME_ID);
            iframe.contentWindow.postMessage({code: code}, '*');
            window.addEventListener('message', function sendCallback(event) {
                window.removeEventListener('message', sendCallback);
                deferred.resolve(event.data.result);
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
         * @return {object} $q promise
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
