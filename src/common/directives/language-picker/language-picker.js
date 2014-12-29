angular.module('languagePicker', [
    'pascalprecht.translate',
])

.directive('languagePicker', ['$translate', function ($translate) {
    return {
        restrict: 'E',
        templateUrl: 'common/directives/language-picker/language-picker.html',
        link: function (scope) {
            scope.languages = {
                EN: 'en',
                RU: 'ru'
            };
            scope.currentLanguage = scope.languages.EN;
            scope.setLanguage = function (language) {
                scope.currentLanguage = language;
                $translate.use(language);
            };
        }
    };
}])

;
