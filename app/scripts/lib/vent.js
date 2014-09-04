'use strict'

/**
 * Very simple event system to allow communication through the code
 */
window.TTT.Vent = (function(window) {
    return {
        subscribers: {},
        requesters: {},

        // simple pub/sub
        pub: function(event_name, args){
            var handlers = this.subscribers[event_name];
            for(var i=0;i<handlers.length;i++){
                handlers[i].apply(this, args);
            }
        },

        sub: function(event_name, handler){
            if(!this.subscribers[event_name]) {
                this.subscribers[event_name] = [];
            }

            this.subscribers[event_name].push(handler);
        },

        // simple request w/ listener
        request: function(event_name, arg) {
            return this.requesters[event_name](arg);
        },

        on: function(event_name, handler) {
            this.requesters[event_name] = handler;
        }
    };
})(window);