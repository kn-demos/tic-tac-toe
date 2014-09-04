'use strict'

window.TTT.Modules.Game.View = (function(window, App) {
    var Board;

    Board = function(options) {
        App.View.Base.prototype.constructor.apply(this, arguments);

        this.templates = {
            board: '<ul class="board grid"></ul>',
            tile: '<li class="grid__item one-third"></li>',
            over: '<li class="game-over displaynone"><h2 class="status"></h2><p class="restart">Click to restart game</p></li>'
        };

        this.controller = options.controller;

        if(options.tiles) {
            this.tiles = options.tiles;
        }

        // get the board and attach it to the body (or selector)
        this.render();

        this.board.addEventListener('click', this.handleClick.bind(this))
    };

    Board.prototype = Object.create(App.View.Base.prototype);

    Board.prototype.render = function() {
        var i, buffer, wrapper,
            div = document.createElement(('div'));

        buffer = this.renderTiles();

        div.innerHTML = this.templates.board;
        wrapper = div.firstChild;
        wrapper.appendChild(buffer.cloneNode(true));

        this.board = wrapper.cloneNode(true);

        this.el.appendChild(this.board);
    };

    Board.prototype.renderTiles = function() {
        var i, buffer,
            div = document.createElement(('div')),
            count = this.tiles.length;

        if(count) {
            buffer  = document.createDocumentFragment();
            for(i = 0; i < count; i++) {
                div.innerHTML = this.templates.tile;

                if(this.tiles[i].first) {
                    div.firstChild.className += ' first';
                }

                if(this.tiles[i].last) {
                    div.firstChild.className += ' last';
                }

                div.firstChild.setAttribute('data-coords', this.tiles[i].coords);

                buffer.appendChild(div.firstChild);
            }
        }

        div.innerHTML = this.templates.over;
        buffer.appendChild(div.firstChild);

        return buffer;
    };

    Board.prototype.restart = function(tiles) {
        var buffer, div = document.createElement(('div'));

        this.setTiles(tiles);
        buffer = this.renderTiles();
        div.appendChild(buffer.cloneNode(true));

        this.board.innerHTML = div.innerHTML;
    };

    Board.prototype.handleClick = function(e) {
        var target = e.target;

        if(target.className.indexOf('game-over') !== -1) {
            this.endGame();
        }
        else if(target.className.indexOf('grid__item') !== -1) {
            this.controller.Vent.pub('tile:clicked', [target, target.getAttribute('data-coords').split(','), target.getAttribute('data-clicked')]);
        }

        return false;
    };

    Board.prototype.endGame = function() {
        this.controller.Vent.pub('restart:clicked');
    };

    Board.prototype.setToken = function(target, token) {
        if(!target.getAttribute('data-clicked')) {
            target.setAttribute('data-clicked', true);
            target.className += ' clicked';
        }

        target.innerHTML = token;
    };

    Board.prototype.getTile = function(position) {
        return this.board.getElementsByClassName('grid__item')[position];
    };

    Board.prototype.setTiles = function(tiles) {
        this.tiles = tiles;
    };

    return Board;
})(window, window.TTT);