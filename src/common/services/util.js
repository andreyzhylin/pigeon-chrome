angular.module('pigeon.util', [])

.factory('util', function () {
    return {
        /**
         * @description
         * Removes value from array.
         *
         * @param  {array} array
         * @param  {*}     value
         * @return {*} Removed value
         */
        arrayRemove: function (array, value) {
            var index = array.indexOf(value);
            if (index >= 0) {
                array.splice(index, 1);
            }
            return value;
        }
    };
})

;
