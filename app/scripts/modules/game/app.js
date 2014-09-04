'use strict'

window.TTT.Modules.Game = (function(window, App) {
    var API, Game;

    Game = {};

    API = {
        start: function(options) {
            var controller =  new App.Modules.Game.Controller(options);
        }
    };

    App.addInitializer(function() {
        API.start({
            selector: '.board'
        });
    });

    App.Vent.sub('module:game', function(options) {
        API.start(options);
    });

    return Game;
})(window, window.TTT);