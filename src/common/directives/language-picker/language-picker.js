angular.module('languagePicker', [
    'pascalprecht.translate',

    'pigeon.settingsService',

    'templates.common'
])

.directive('languagePicker', ['$translate', 'settingsService', function ($translate, settingsService) {
    return {
        restrict: 'E',
        templateUrl: 'common/directives/language-picker/language-picker.html',
        link: function (scope) {
            scope.languages = {
                EN: 'en',
                RU: 'ru'
            };
            settingsService.init().then(function () {
                scope.currentLanguage = settingsService.getLanguage();
                $translate.use(scope.currentLanguage);
            });
            scope.setLanguage = function (language) {
                scope.currentLanguage = language;
                settingsService.setLanguage(language);
                $translate.use(language);
            };
        }
    };
}])

;
