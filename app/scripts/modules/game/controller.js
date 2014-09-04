'use strict'

window.TTT.Modules.Game.Controller = (function(window, App) {
    var Controller = function() {
        App.Controller.Base.prototype.constructor.apply(this, arguments);

        this.players = [
            App.Vent.request('entities:player', {
                ai: false,
                turn: 0
            }),
            App.Vent.request('entities:player', {
                ai: true,
                turn: 1
            })
        ];

        this.game = App.Vent.request('entities:game');

        this.addSubscribers();

        this.board = new App.Modules.Game.View({
            tiles: this.game.tiles,
            controller: this
        });

        // create new view. render new view
        // listen for events coming from view
    };

    Controller.protoype = Object.create(App.Controller.Base.prototype);

    Controller.prototype.addSubscribers = function() {
        this.Vent.sub('tile:clicked', this.handleTileClick.bind(this));
        this.Vent.sub('restart:clicked', this.restart.bind(this));
    };

    Controller.prototype.handleTileClick = function(target, coords, is_clicked) {
        if(this.game.isOver()) {
            this.restart();
            return false;
        }

        var move, turn = this.game.getTurn();

        if(this.players[turn].ai || is_clicked) {
            return false;
        }

        this.board.setToken(target, this.players[turn].token);
        this.game.playTile(coords); // ticks turn

        turn = this.game.getTurn();

        if(this.players[turn].ai && !this.game.isOver()) {
            // have ai take turn here
            coords = this.players[turn].getBestMove(this.game).coords;
            target = this.board.getTile(this.game.dims.w * coords[0] + coords[1]);

            this.board.setToken(target, this.players[turn].token);
            this.game.playTile(coords);
        }
    };

    Controller.prototype.restart = function() {
        this.game.restart();
        this.board.restart(this.game.getTiles());
    };

    return Controller;
})(window, window.TTT);