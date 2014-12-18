angular.module('language-picker', ['pascalprecht.translate'])

.directive('languagePicker', function () {
    return {
        restrict: 'E',
        controller: function ($scope, $translate) {
            $scope.languages = {
                EN: 'en',
                RU: 'ru'
            };
            $scope.currentLanguage = $scope.languages.EN;
            $scope.setLanguage = function (language) {
                $scope.currentLanguage = language;
                $translate.use(language);
            };
        },
        templateUrl: 'common/directives/language-picker/language-picker.html'
    };
})

;
