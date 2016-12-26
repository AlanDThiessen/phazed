
var fs = require('fs');

var FILE_PATH = '~/games/';

(function() {
    /*************************************************************************
     * Interface functions
     *************************************************************************/
    function LoadGame(gameId) {
        var game = NewGame({'gameId': gameId});
        game.read();
    }


    /*************************************************************************
     * Game object
     *************************************************************************/
    var Game = {
        'gameId': '',
        'players': {},

        init: GameInit,
        read: ReadGameFile,
        save: WriteGameFile,
        addPlayer: AddPlayer
    };


    function GameInit(defObj) {
        this.gameId = defObj.gameId;
        this.players = {};

        for(var playerCntr = 0; playerCntr < defObj.players.length; playerCntr++ ) {
            this.AddPlayer(defObj.players[playerCntr]);
        }
    }

    
    function NewGame(defObj) {
        var game = Object.create(Game);
        game.init(defObj);

        return game;
    }


    function AddPlayer(defObj) {
        var player;

        if(typeof(defObj.name) != 'undefined') {
            player = Object.create(Player);
            player.init(defObj);
            this.players[player.name] = player;
        }

        return player;
    }


    function ReadGameFile() {
        var filePath = FILE_PATH + this.gameId + '.game';

        if(fs.existsSync(filePath)) {
            this.GameInit(JSON.parse(fs.readFileSync(filePath)));
        }
    }


    function WriteGameFile() {
        var filePath = FILE_PATH + this.gameId + '.game';
        fs.writeFileSync(filePath, JSON.stringify(this));
    }


    /*************************************************************************
     * Player object
     *************************************************************************/
    var Player = {
        'name': '',
        'phase': 1,
        'score': 0,

        init: InitPlayer,
        setPhase: SetPhase,
        setScore: SetScore,
        upPhase: UpPhase,
        addScore: AddScore
    };


    function InitPlayer(defObj) {
        this.name = defObj.name || '';
    }


    function SetPhase(phase) {
        if((phase > 0 ) && (phase <= 10)) {
            this.phase = phase;
        }
    }


    function SetScore(score) {
        if(score >= 0) {
            this.score = score;
        }
    }


    function UpPhase() {
        if(this.phase < 10) {
            this.phase++;
        }
    }


    function AddScore(score) {
        this.score += score;
    }


    module.exports = {
        LoadGame: LoadGame
    }

})();
