'use strict'

window.TTT.Models.Player = (function(window, App) {
    var Players, Player, API;

    Player = function(options) {
        this.ai = options.ai || false;
        this.best_move = null;
        this.turn = options.turn || 0;
        this.token = this.turn === 0 ? 'x' : 'o';
    };

    Player.prototype.getToken = function() {
        return this.token;
    };

    Player.prototype.getBestMove = function(game) {
        var test_game = this.getGameCopy(game),
            score = this.runAi(test_game, 0);

        return this.best_move
    };

    Player.prototype.getGameCopy = function(game) {
        return App.Vent.request('entities:game', {
            turn: game.getTurn(),
            tiles: game.getTiles(),
            moves: game.getMoves(),
            winner: game.getWinner(),
            deep: true
        });
    };

    // ai
    Player.prototype.getScore = function(game, depth) {
        var opponent = this.turn === 0 ? 1 : 0;

        if(game.isWinner(this.turn)) {
            return 10 - depth;
        }
        else if(game.isWinner(opponent)) {
            return depth - 10;
        }

        return 0;
    };

    Player.prototype.runAi = function(game, depth) {
        var i, arr_len, available_moves,
            new_game, move, score, max_or_min,
            move_data = [];

        if(game.isOver()) {
            score = this.getScore(game, depth);
            return score;
        }

        if(depth == null) { depth = 0; }
        depth++;

        available_moves = game.getAvailableMoves();

        arr_len = available_moves.length;

        for(i = 0; i < arr_len; i++) {
            move = available_moves[i];

            // create new game with old game state
            new_game =  this.getGameCopy(game);

            // set new state
            new_game.playTile(move.coords);

            // recursively run through all moves and get scores
            score = this.runAi(new_game, depth);

            move_data.push({
                move: move,
                score: score
            });
        }

        // Do the min or the max calculation always on the real games turn
        if(game.getTurn() === this.turn) {
            // max
            max_or_min = move_data.reduce(function(prev, curr) {
                return prev.score > curr.score ? prev : curr;
            });
        }
        else {
            // min
            max_or_min = move_data.reduce(function(prev, curr) {
                return prev.score < curr.score ? prev : curr;
            });
        }

        this.best_move = max_or_min.move;
        return max_or_min.score;
    };



    App.Vent.on('entities:player', function(options) {
        return new Player(options);
    });
})(window, window.TTT);