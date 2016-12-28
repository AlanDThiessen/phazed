
var express = require('express');
var bodyParser = require('body-parser');
var alexaHandler = require('./AlexaPhazedHandler.js');

var app = express();
app.use(bodyParser.json());
app.set('trust proxy', 'loopback');

app.post('/', function(req, res) {
    res.send(alexaHandler.HandleRequest(req.body));
});


app.listen('1225', 'localhost', function() {
   console.log('Phazed listening on port 1225');
});
