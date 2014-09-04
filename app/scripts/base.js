'use strict'

// TicTacToe game global
window.TTT = (function(window) {
    var TTT, API, _id = 0;

    // private api
    API = {
        initializers: [],

        addInitializer: function(fn) {
            this.initializers.push(fn);
        },

        runInitializers: function() {
            var i, len = this.initializers.length;

            for(i = 0; i < len; i++) {
                this.initializers[i]();
            }
        }
    };



    TTT = {
        Models: {},
        Modules: {},
        Vent: {},
        Controller: {},
        View: {},

        _registry: {},

        register: function(controller) {
            if(controller._id) {
                return;
            }

            controller._id = { id: _id };
            Object.freeze(controller._id);
            this._registry[_id++] = controller;
        },

        unregister: function(controller) {
            delete this._registry[controller._id.id];
        },

        addInitializer: function(fn) {
            API.addInitializer(fn);
        },

        start: function() {
            API.runInitializers();
        }
    };

    return TTT;
})(window);

