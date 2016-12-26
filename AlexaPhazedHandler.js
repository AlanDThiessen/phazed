

(function() {
    'use strict';

    var phaseScore = require('PhaseScore.js');

    var HANDLERS = {
        NewGame: HandleNewGame
    };


    var AlexaResponse = {
        'version': '1.0',
        'sessionAttributes': {
        },
        'response': {
            'shouldSessionEnd': false
        }
    };


    function HandleRequest(body) {
        var gameId = body.session.user.userId;
        var game = phaseScore.LoadGame(gameId);
        var intent = body.request.intent.name;
        var response;

        if(typeof(HANDLERS[intent]) != 'undefined') {
            response = HANDLERS[intent](game);
        }
        else {
            response = DefaultHandlerNoIntent();
        }

        return response;
    }


    function DefaultHandlerNoIntent() {
        var response = Object.create(AlexaResponse);
        AddSpeech(response, "Please repeat your command.  You can say New Game, Add Player, or Get Player Score, for example.");
    }


    function HandleNewGame(game) {
        game.init(game.gameId);
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