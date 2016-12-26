
var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.json());
app.set('trust proxy', 'loopback');

app.post('/', function(req, res) {
    console.log(req.body);
    res.send('hello world');
});


app.listen('1225', 'localhost', function() {
   console.log('Phazed listening on port 1225');
});
