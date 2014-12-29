angular.module('pigeon.fileService', [
    'pigeon.chromeService',

    'pigeon.util',
])

.factory('fileService', ['$q', 'chromeService', 'util', 'statuses', function ($q, chromeService, util, statuses) {
    var _files = [];
    var _browserService = chromeService;

    /**
     * @description
     * Saves files to browser storage.
     */
    var _saveData = function () {
        var data = JSON.stringify(_files);
        _browserService.saveData(util.STORAGE_FILES_KEY, data);
    };

    /**
     * @description
     * Parses files from JSON
     *
     * @param  {string} data Storage data in JSON
     * @return {array}  Files
     */
    var _prepareFiles = function (data) {
        var files = JSON.parse(data[util.STORAGE_FILES_KEY]);
        return angular.isDefined(files) ? files : [];
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
            _browserService.loadData(util.STORAGE_FILES_KEY).then(function (data) {
                _files = _prepareFiles(data);
                deferred.resolve();
            });
            return deferred.promise;
        },

        /**
         * @description
         * Returns current array of files.
         *
         * @return {array} Files
         */
        getAll: function () {
            return _files;
        },

        /**
         * @description
         * Returns file by index.
         *
         * @param  {number} fileIndex File index in array
         * @return {object} File object
         */
        get: function (fileIndex) {
            return _files[fileIndex];
        },

        /**
         * @description
         * Adds file to array and refreshes browser storage.
         *
         * @param {object} file File to add
         */
        add: function (file) {
            _files.push(file);
            _saveData();
        },

        /**
         * @description
         * Edits file and refreshes browser storage.
         *
         * @param {object} file      New file data
         * @param {object} fileIndex File index in array
         */
        edit: function (file, fileIndex) {
            _files[fileIndex].name = file.name;
            _files[fileIndex].code = file.code;
            _saveData();
        },

        /**
         * @description
         * Removes file from array and refreshes browser storage.
         *
         * @param {object} file File to remove
         */
        remove: function (file) {
            util.arrayRemove(_files, file);
            _saveData();
        }
    };
    return storage;
}])

;
