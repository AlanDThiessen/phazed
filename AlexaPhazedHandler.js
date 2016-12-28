

(function() {
    'use strict';

    var phaseScore = require('./PhaseScore.js');

    var HANDLERS = {
        NewGame: HandleNewGame,
        AddPlayer: HandleNewPlayer,
        RemovePlayer: HandlerRemovePlayer,
        ListPlayers: HandleListPlayers,
        SetPhase: HandlerSetPhase,
        SetScore: HandlerSetScore,
        AddScore: HandlerAddScore,
        UpPhase: HandlerUpPhase,
        GetScore: HandlerGetScore,
        GetLeader: HandlerGetLeader,
        GetPhaseInfo: HandlerGetPhaseInfo
    };


    var AlexaResponse = {
        'version': '1.0',
        'sessionAttributes': {},
        'response': {
            'shouldSessionEnd': false
        }
    };


    function HandleRequest(body) {
        var gameId = body.session.user.userId;
        var game = phaseScore.LoadGame(gameId);
        var intent = body.request.intent;
        var response;

        console.log('Intent: ' + intent);

        if(typeof(HANDLERS[intent.name]) != 'undefined') {
            response = HANDLERS[intent.name](game, intent);
        }
        else {
            response = DefaultHandlerNoIntent();
        }

        console.log(response);
        return JSON.stringify(response);
    }


    function DefaultHandlerNoIntent() {
        var resp = AlexaResponse;
        AddSpeech(resp, "Please repeat your command.  You can say New Game, Add Player, or Get Player Score, for example.");
        return resp;
    }


    function HandleNewGame(game) {
        game.save();
        var resp = AlexaResponse;
        AddSpeech(resp, "A new game has been created");
        return resp;
    }


    function HandleNewPlayer(game, intent) {
        var player = game.addPlayer({'name': intent.slots.Player.value});
        game.save();
        var resp = AlexaResponse;
        AddSpeech(resp, "Player " + player.name + ' has been added to the game on phase ' + player.phase + ' and score ' + player.score);
        return resp;
    }



    function HandlerRemovePlayer(game, intent) {
        var player = game.players[intent.slots.Player.value];
        var resp = AlexaResponse;

        if(typeof(player) == 'undefined') {
            AddSpeech(resp, "Player " + intent.slots.Player.value + ' was not found in the game');
        }
        else {
            game.removePlayer(player.name);
            game.save();
            AddSpeech(resp, player.name + ' has been removed from the game');
        }

        return resp;
    }


    function HandleListPlayers(game, intent) {
        var players = game.getPlayers();
        var playerNames = [];
        var resp = AlexaResponse;

        players.forEach(function(player) {
            playerNames.push(player.name);
        });

        AddSpeech(resp, "Players, in order of score, are: " + playerNames.join(', '));
        return resp;
    }


    function HandlerSetPhase(game, intent) {
        var player = game.players[intent.slots.Player.value];
        var resp = AlexaResponse;

        if(typeof(player) == 'undefined') {
            AddSpeech(resp, "Player " + intent.slots.Player.value + ' was not found in the game');
        }
        else {
            player.setPhase(parseInt(intent.slots.Phase.value));
            game.save();
            AddSpeech(resp, player.name + ' is now on Phase ' + player.phase);
        }

        return resp;
    }


    function HandlerSetScore(game, intent) {
        var player = game.players[intent.slots.Player.value];
        var resp = AlexaResponse;

        if(typeof(player) == 'undefined') {
            AddSpeech(resp, "Player " + intent.slots.Player.value + ' was not found in the game');
        }
        else {
            player.setScore(parseInt(intent.slots.Score.value));
            game.save();
            AddSpeech(resp, player.name + ' now has ' + player.score + ' points');
        }

        return resp;
    }


    function HandlerAddScore(game, intent) {
        var player = game.players[intent.slots.Player.value];
        var resp = AlexaResponse;

        if(typeof(player) == 'undefined') {
            AddSpeech(resp, "Player " + intent.slots.Player.value + ' was not found in the game');
        }
        else {
            player.addScore(parseInt(intent.slots.Score.value));
            game.save();
            AddSpeech(resp, player.name + ' now has ' + player.score + ' points');
        }

        return resp;
    }


    function HandlerUpPhase(game, intent) {
        var player = game.players[intent.slots.Player.value];
        var resp = AlexaResponse;

        if(typeof(player) == 'undefined') {
            AddSpeech(resp, "Player " + intent.slots.Player.value + ' was not found in the game');
        }
        else {
            player.upPhase();
            game.save();
            AddSpeech(resp, player.name + ' is now on phase ' + player.phase);
        }

        return resp;
    }


    function HandlerGetScore(game, intent) {
        var player = game.players[intent.slots.Player.value];
        var resp = AlexaResponse;

        if(typeof(player) == 'undefined') {
            AddSpeech(resp, "Player " + intent.slots.Player.value + ' was not found in the game');
        }
        else {
            if(player.phase == 11) {
                AddSpeech(resp, player.name + ' has finished  with ' + player.score + ' points');
            }
            else {
                AddSpeech(resp, player.name + ' is now on phase ' + player.phase + ' with ' + player.score + ' points');
            }
        }

        return resp;
    }


    function HandlerGetLeader(game, intent) {
        var player = game.getLeadPlayer();
        var resp = AlexaResponse;

        if(typeof(player) == 'undefined') {
            AddSpeech(resp, "I'm sorry, I could not determine a leader");
        }
        else {
            if(player.phase == 11) {
                AddSpeech(resp, player.name + ' has finished  with ' + player.score + ' points');
            }
            else {
                AddSpeech(resp, player.name + ' is in the lead on phase ' + player.phase + ' with ' + player.score + ' points');
            }
        }

        return resp;
    }


    function HandlerGetPhaseInfo(game, intent) {
        var resp = AlexaResponse;
        AddSpeech(resp, phaseScore.GetPhaseInfo(intent.slots.Phase.value));
        return resp;
    }


    function AddSpeech(response, text) {
        response.response.outputSpeech = {
            'type': 'PlainText',
            'text': text
        }
    }


    module.exports = {
        HandleRequest: HandleRequest
    }
})();