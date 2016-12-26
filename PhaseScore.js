
var fs = require('fs');

(function() {

    var Player = {
        'name': '',
        'phase': 1,
        'score': 0,

        init: InitPlayer
    };


    var Game = {
        'userId': '',
        'players': [],

        init: GameInit,
        addPlayer: AddPlayer
    };


    var GameInit(defObj) {
        this.userId = defObject.userId;
        this.players = [];

        for(var playerCntr = 0; playerCntr < defObj.players.length; playerCntr++ ) {
            this.AddPlayer(defObj.players[playerCntr]);
        }
    }

    
    function NewGame(defObj) {
        var game = Object.create(Game);
        game.init(defObj);

        return game;
    }

    function InitPlayer(defObjt) {
        this.name = defObj.name || '';
    }

    function AddPlayer(defObj) {
        var player = Object.create(Player);
        player.name = name;
    }


    exports = {
        LoadGame: NewGame
    }

})();
