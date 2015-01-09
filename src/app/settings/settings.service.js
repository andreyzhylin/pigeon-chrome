angular.module('pigeon.settingsService', [
    'pigeon.chromeService'
])

.factory('settingsService', ['$q', 'chromeService', 'util', function ($q, chromeService) {
    var _settings = {};
    var _browserService = chromeService;

    var STORAGE_SETTINGS_KEY = 'SETTINGS';

    /**
     * @description
     * Saves settings to browser storage.
     */
    var _saveData = function () {
        var data = JSON.stringify(_settings);
        _browserService.saveData(STORAGE_SETTINGS_KEY, data);
    };

    /**
     * @description
     * Parses settings from JSON
     *
     * @param  {string} data Storage data in JSON
     * @return {array}  settings
     */
    var _prepare = function (data) {
        return angular.isDefined(data[STORAGE_SETTINGS_KEY]) ? JSON.parse(data[STORAGE_SETTINGS_KEY]) :
            {
                executionTimeout: 5000,
                language: 'EN',
                hideSuccess: false
            };
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
            _browserService.loadData(STORAGE_SETTINGS_KEY).then(function (data) {
                _settings = _prepare(data);
                deferred.resolve();
            });
            return deferred.promise;
        },

        /**
         * @description
         * Returns execution timeout
         *
         * @return {number} Execution timeout
         */
        getExecutionTimeout: function () {
            return _settings.executionTimeout;
        },

        /**
         * @description
         * Sets execution timeout
         *
         * @param {number} timeout Execution timeout
         */
        setExecutionTimeout: function (timeout) {
            _settings.executionTimeout = timeout;
            _saveData();
        },

        /**
         * @description
         * Returns current language
         *
         * @return {string} Current language
         */
        getLanguage: function () {
            return _settings.language;
        },

        /**
         * @description
         * Sets current language
         *
         * @param {number} language Current language
         */
        setLanguage: function (language) {
            _settings.language = language;
            _saveData();
        },

        /**
         * @description
         * Returns setting - should hide success tests in overview table
         *
         * @return {Boolean} should hide success setting
         */
        getHideSuccess: function () {
            return _settings.hideSuccess;
        },

        /**
         * @description
         * Sets setting - should hide success tests in overview table
         *
         * @param {Boolean} hideSuccess should hide success setting
         */
        setHideSuccess: function (hideSuccess) {
            _settings.hideSuccess = hideSuccess;
            _saveData();
        }
    };
    return storage;
}])

;
