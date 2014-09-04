'use strict'

window.TTT.View.Base = (function(window, App) {
    var Base;

    Base = function(options) {
        if(options.el) {
            this.el = el;
        }
        else {
            this.el = document.body;
        }

        //if(this.events && this.el) {
        //    this.attachEvents();
        //}
    };

    Base.prototype.delete = function() {

    };
     /**
    Base.prototype.attachEvents = function() {
        var e;
        for(e in this.events) {
            if (hasOwnProperty.call(this.events, e)) {
                this.el.
            }
        }
    };
    **/
    // put in here clean up code and different types of render or find/get elements

    return Base;
})(window, window.TTT);