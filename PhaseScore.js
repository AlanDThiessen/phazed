

(function() {
    'use strict';

    var fs = require('fs');
    var FILE_PATH = './games/';

    var PHASES = {
        1: "2 sets of 3",
        2: "1 set of 3 and 1 run of 4",
        3: "1 set of 4 and 1 run of 4",
        4: "1 run of 7",
        5: "1 run of 8",
        6: "1 run of 9",
        7: "2 sets of 4",
        8: "7 cards or one color",
        9: "1 set of 5 and 1 set of 2",
        10: "1 set of 5 and 1 set of 3"
    };

    /*************************************************************************
     * Interface functions
     *************************************************************************/
    function LoadGame(gameId) {
        var game = NewGame({'gameId': gameId});
        game.read();
        return game;
    }


    function GetPhaseInfo(phase) {
        console.log(phase);
        if((phase > 0) && (phase <= 10)) {
            return PHASES[phase];
        }
        else {
            return 'phase not found';
        }
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
        addPlayer: AddPlayer,
        removePlayer: RemovePlayer,
        getPlayers: GetPlayersArray,
        getLeadPlayer: GetPlayerInLead
    };


    function GameInit(defObj) {
        this.gameId = defObj.gameId;
        this.players = {};

        if(typeof(defObj.players) != 'undefined') {
            for(var player in defObj.players) {
                if(defObj.players.hasOwnProperty(player)) {
                    this.addPlayer(defObj.players[player]);
                }
            }
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


    function RemovePlayer(name) {
        if(typeof(this.players[name]) != 'undefined') {
            delete this.players[name];
        }
    }


    function GetPlayersArray() {
        var players = [];

        for(var player in this.players) {
            if(this.players.hasOwnProperty(player)) {
                players.push(this.players[player]);
            }
        }


        return players.sort(PlayerSort);
    }


    function GetPlayerInLead() {
        var players = this.getPlayers();
        return players[0];
    }


    /**
     * @param a
     * @param b
     * @returns {boolean}
     */
    function PlayerSort(a, b) {
        if(a.phase == b.phase) {
            return a.score > b.score;
        }
        else {
            return a.phase < b.phase;
        }
    }


    function ReadGameFile() {
        var filePath = FILE_PATH + this.gameId + '.game';

        if(fs.existsSync(filePath)) {
            this.init(JSON.parse(fs.readFileSync(filePath)));
        }
    }


    function WriteGameFile() {
        var filePath = FILE_PATH + this.gameId + '.game';
        fs.writeFileSync(filePath, JSON.stringify(this, null, 3));
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
        this.phase = defObj.phase || 1;
        this.score = defObj.score || 0;
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
        if(this.phase < 11) {
            this.phase++;
        }
    }


    function AddScore(score) {
        this.score += score;
    }


    module.exports = {
        LoadGame: LoadGame,
        GetPhaseInfo: GetPhaseInfo
    }

})();
