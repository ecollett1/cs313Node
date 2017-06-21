var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var postage = require('./postage.js');

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  	response.sendFile(__dirname + '/public/letter.html');
});

app.get('/postage', function(req, res) {
	var weight = req.query.weight;
	var type = req.query.letterType;

	postage.calculateRate(weight, type, function(error, results) {
		res.render("pages/results", results);
	});
});

app.listen(app.get('port'), function() {
  	console.log('Node app is running on port', app.get('port'));
});