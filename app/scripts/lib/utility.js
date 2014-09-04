'use strict'

window.TTT.Utility = (function(window, App) {
    return {
        extend: function(obj) {
            var source, prop;

            for (var i = 1, length = arguments.length; i < length; i++) {
                source = arguments[i];
                for (prop in source) {
                    if (hasOwnProperty.call(source, prop)) {
                        obj[prop] = source[prop];
                    }
                }
            }

            return obj;
        }
    }
})(window, window.TTT);