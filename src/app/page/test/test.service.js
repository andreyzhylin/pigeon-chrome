angular.module('pigeon.testService', [
    'pigeon.pageService',

    'pigeon.util',
    'pigeon.statuses'
])

.factory('testService', ['pageService', 'util', 'statuses', function (pageService, util, statuses) {
    var storage = {
        /**
         * @description
         * Loads data from browser storage.
         */
        init: function () {
            return pageService.init();
        },

        /**
         * @description
         * Returns tests on page.
         *
         * @param  {number} pageIndex Index of page which tests belongs to
         * @return {array} Array of tests on page
         */
        getAll: function (pageIndex) {
            return pageService.get(pageIndex).tests;
        },

        /**
         * @description
         * Returns test by index and page index.
         *
         * @param  {number} pageIndex Index of page which test belongs to
         * @param  {number} testIndex Test index in array
         * @return {object} Test object
         */
        get: function (pageIndex, testIndex) {
            return pageService.get(pageIndex).tests[testIndex];
        },

        /**
         * @description
         * Adds test to array and refreshes browser storage.
         *
         * @param {object} test      Test to add
         * @param {number} pageIndex Index of page which test belongs to
         */
        add: function (test, pageIndex) {
            test.status = statuses.UNKNOWN;
            test.isExecuting = false;
            test.page = pageService.get(pageIndex);
            if (!angular.isDefined(test.page.tests)) {
                test.page.tests = [];
            }
            test.page.tests.push(test);
            pageService.save();
        },

        /**
         * @description
         * Edits test and refreshes browser storage.
         *
         * @param {object} test      New test data
         * @param {number} pageIndex Index of page which test belongs to
         * @param {number} testIndex Test index in page array
         */
        edit: function (test, pageIndex, testIndex) {
            var oldTest = pageService.get(pageIndex).tests[testIndex];
            if (oldTest.code !== test.code) {
                oldTest.status = statuses.UNKNOWN;
            }
            oldTest.description = test.description;
            oldTest.code = test.code;
            oldTest.isDebug = test.isDebug;
            pageService.save();
        },

        /**
         * @description
         * Removes test and refreshes browser storage.
         *
         * @param {object} test Test to remove
         */
        remove: function (test) {
            var pageIndex = pageService.getAll().indexOf(test.page);
            util.arrayRemove(pageService.get(pageIndex).tests, test);
            pageService.save();
        }
    };
    return storage;
}])

;
