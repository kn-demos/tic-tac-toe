'use strict'

window.TTT.Models.Game = (function(window, App) {
    var Game, Tile;

    Tile = function(options) {
        this.coords = options.coords || [0,0];
        this.owner = options.owner == null ? null : options.owner;
        this.first = options.first || false;
        this.last = options.last || false;
    };

    Game = function(options) {
        this.restart(options);
    };

    Game.prototype.restart = function(options) {
        options = options || {};

        this.tiles = [];

        this.winner = options.winner || null; // if game over and winner === null => cats game
        this.turn = options.turn || 0; // 0/1 for whose turn it is
        this.moves = options.moves || 0;
        this.dims = options.dims || { w: 3, h: 3 };

        if(options.tiles && !options.deep) {
            this.tiles = options.tiles;
        }
        else {
            this.createTiles(options.tiles);
        }

    };

    Game.prototype.createTiles = function(tiles) {
        var i, j, tile;

        for(i = 0; i < this.dims.w; i++) {
            for(j = 0; j < this.dims.h; j++) {
                if(tiles != null) {
                    tile = this.copyTile(tiles[this.dims.w*i+j]);
                }
                else {
                    tile = new Tile({ coords: [i,j] })

                    if(j % this.dims.w === 0) {
                        tile.first = true;
                    }

                    if((i+1) % this.dims.h === 0) {
                        tile.last = true;
                    }
                }

                this.tiles.push(tile);
            }
        }
    };

    Game.prototype.copyTile = function(tile) {
        return new Tile({
            coords: tile.coords,
            owner: tile.owner,
            first: tile.first,
            last: tile.last
        });
    };

    Game.prototype.tick = function() {
        this.turn = this.getNextTurn();
        return this;
    };

    Game.prototype.getTurn = function() {
        return this.turn;
    };

    Game.prototype.getNextTurn = function() {
        return this.turn === 0 ? 1 : 0;
    };

    Game.prototype.getMoves = function() {
        return this.moves;
    };

    Game.prototype.getWinner = function() {
        return this.winner;
    };

    Game.prototype.getTiles = function() {
        return this.tiles;
    };

    Game.prototype.isWinner = function(turn) {
        return turn === this.winner;
    };

    Game.prototype.win = function(turn) {
        this.winner = turn;
    };

    Game.prototype.isOver = function() {
        return this.winner !== null || this.usedMaxMoves() || this.getAvailableMoves().length === 0;
    };

    Game.prototype.getAvailableMoves = function() {
        return this.tiles.filter(function(tile) {
            return tile.owner === null;
        });
    };

    Game.prototype.usedMaxMoves = function() {
        return this.moves === this.dims.w * this.dims.h;
    };

    Game.prototype.playTile = function(coords) {
        var x = parseInt(coords[0], 10),
            y = parseInt(coords[1], 10);

        this.tiles[this.dims.w * x + y].owner = this.turn;
        this.moves++;

        // check if there is a winner
        this.hasWinner();

        if(!this.isOver()) {
            this.tick();
        }
    };

    // check if there is a winner
    Game.prototype.hasWinner = function() {
        var checks;

        if(this.moves >= (this.dims.w*2-1) && !this.usedMaxMoves()) {
            // directions to check
            checks = ['row', 'col', 'diag'];

            while(!this.isOver() && checks.length !== 0) {
                this.checkConnections(checks.shift());
            }
        }

        return this;
    };

    Game.prototype.checkConnections = function(direction) {
        var i, j, player, tile, index,
            can_win, checkTile, checkWin,
            outer_loop_len = direction === 'diag' ? 2 : this.dims.w;

        // private functions taking advantage of scope
        checkTile = function() {
            tile = this.tiles[index];

            if(tile.owner === null || (player !== null && tile.owner !== player)) {
                can_win = false;
                j = this.dims.w; // manually break out of inner loop
            }

            if(player === null) {
                player = tile.owner;
            }
        }.bind(this);

        checkWin = function() {
            if(can_win) {
                this.win(player);
                return;
            }
        }.bind(this);

        // assuming grid is always square
        for(i = 0; i < outer_loop_len; i++ ) {
            player = null;
            can_win = true;

            for(j = 0; j < this.dims.w; j++) {
                switch(direction) {
                    case 'row':
                        index = this.dims.w*i + j;
                        break;
                    case 'col':
                        index = this.dims.w*j + i;
                        break;
                    case 'diag':
                        if(i === 1) {
                            index = this.dims.w*j + j;
                        }
                        else {
                            index = (j + 1) * (this.dims.w - 1);
                        }

                        break;
                    default:
                        break;

                }

                checkTile();
            }

            checkWin();
        }

        if(direction === 'diag') {
            checkWin();
        }

        return this;
    };


    App.Vent.on('entities:game', function(options) {
        return new Game(options);
    });
})(window, window.TTT);