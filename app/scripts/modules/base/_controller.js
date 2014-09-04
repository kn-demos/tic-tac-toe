'use strict'

window.TTT.Controller.Base = (function(window, App) {
    var Base;

    Base = function() {
        App.register(this);

        this.Vent = App.Utility.extend({}, App.Vent);
    };

    Base.prototype.delete = function() {
    };

    return Base;
})(window, window.TTT);