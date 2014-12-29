angular.module('pigeon.pageService', [
    'pigeon.chromeService',

    'pigeon.util',
    'pigeon.statuses'
])

.factory('pageService', ['$q', 'chromeService', 'util', 'statuses', function ($q, chromeService, util, statuses) {
    var _pages = [];
    var _browserService = chromeService;

    /**
     * @description
     * Saves pages to browser storage.
     */
    var _saveData = function () {
        var data = JSON.stringify(_pages, function (key, value) {
            // pages array has circular structure, we should remove links to pages
            return key === 'page' ? undefined : value;
        });
        _browserService.saveData(util.STORAGE_PAGES_KEY, data);
    };

    /**
     * @description
     * Sets links to pages and reset executing.
     *
     * @param  {string} data Storage data in JSON
     * @return {array} Pages
     */
    var _preparePages = function (data) {
        var pages = JSON.parse(data[util.STORAGE_PAGES_KEY]);
        angular.forEach(pages, function (page) {
            angular.forEach(page.tests, function (test) {
                test.page = page;
                test.isExecuting = false;
            });
        });
        return angular.isDefined(pages) ? pages : [];
    };

    var storage = {
        /**
         * @description
         * Loads data from browser storage.
         *
         * @return {object} $q promise
         */
        init: function () {
            var deferred = $q.defer();
            _browserService.loadData(util.STORAGE_PAGES_KEY).then(function (data) {
                _pages = _preparePages(data);
                deferred.resolve();
            });
            return deferred.promise;
        },

        /**
         * @description
         * Returns current array of pages.
         *
         * @return {array} Pages
         */
        getAll: function () {
            return _pages;
        },

        /**
         * @description
         * Returns page by index.
         *
         * @param  {number} pageIndex Page index in array
         * @return {object} Page object
         */
        get: function (pageIndex) {
            return _pages[pageIndex];
        },

        /**
         * @description
         * Adds page to array and refreshes browser storage.
         *
         * @param {object} page Page to add
         */
        add: function (page) {
            _pages.push(page);
            _saveData();
        },

        /**
         * @description
         * Edits page and refreshes browser storage.
         *
         * @param {object} page      New page data
         * @param {object} pageIndex Page index in array
         */
        edit: function (page, pageIndex) {
            if (_pages[pageIndex].url !== page.url) {
                angular.forEach(_pages[pageIndex].tests, function (test) {
                    test.status = statuses.UNKNOWN;
                });
            }

            _pages[pageIndex].description = page.description;
            _pages[pageIndex].url = page.url;
            _saveData();
        },

        /**
         * @description
         * Removes page from array and refreshes browser storage.
         *
         * @param {object} page Page to remove
         */
        remove: function (page) {
            util.arrayRemove(_pages, page);
            _saveData();
        },

        /**
         * @description
         * Refreshes browser storage.
         */
        save: function () {
            _saveData();
        }
    };
    return storage;
}])

;
