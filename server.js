var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var postage = require('./postage.js');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'businesscard',
  password: 'sh0m0mm@',
  port: 5432
});

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/home.html');
});

app.get('/letter', function(request, response) {
  	response.sendFile(__dirname + '/public/letter.html');
});

app.get('/project', function (request, response) {
    response.render('pages/start');
});

app.get('/postage', function(req, res) {
	var weight = req.query.weight;
	var type = req.query.letterType;

	postage.calculateRate(weight, type, function(error, results) {
		res.render("pages/results", results);
	});
});

app.get('/getTemplate', function(req, response){
	var id = req.query.id;
	if (id) {
		pool.query('SELECT * FROM template WHERE id = ' + id, (err, res) => {
	  	if (err) {
	    	throw err;
	  	}

		console.log('Person:', res.rows);
		response.send(JSON.stringify(res.rows));
		response.end();
		});
	} else {
		pool.query('SELECT * FROM template WHERE id = 1', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}

		console.log('Template:', res.rows);
		response.send(JSON.stringify(res.rows));
		response.end();
		});
	}
});

app.get('/getUser', function(req, response){
	var id = req.query.id;
	if (id) {
		pool.query('SELECT * FROM card WHERE id = ' + id, (err, res) => {
	  	if (err) {
	    	throw err;
	  	}

		console.log('Card:', res.rows);
		response.send(JSON.stringify(res.rows));
		response.end();
		});
	} else {
		pool.query('SELECT * FROM card WHERE id = 2', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}

		console.log('Card:', config);
		response.send(JSON.stringify(res.rows));
		response.end();
		});
	}
});

app.get('/editUser', function(req, response){
	var id = req.query.id;
	if (id) {
		pool.query('SELECT * FROM card WHERE id = ' + id, (err, res) => {
	  	if (err) {
	    	throw err;
	  	}

		console.log('Card:', res.rows);
		response.send(JSON.stringify(res.rows));
		response.end();
		});
	} else {
		pool.query('SELECT * FROM card WHERE id = 2', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}

		console.log('Card:', config);
		response.send(JSON.stringify(res.rows));
		response.end();
		});
	}
});

app.listen(app.get('port'), function() {
  	console.log('Node app is running on port', app.get('port'));
});
