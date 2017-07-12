var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var postage = require('./postage.js');
const { Pool } = require('pg');
const path = require('path');
var email;
var pg = require('pg');

// Default database configuration options. For localhost!
var config = {
  user: 'postgres',
  host: 'localhost',
  database: 'businesscard',
  password: 'sh0m0mm@',
  port: 5432
};

// Require the URL module for parsing the DATABASE_URL environment variable.
const url = require('url');

// Check to see if we're running out at Heroku...
if (process.env.DATABASE_URL) {
  // Parse that sucker.
  var params = url.parse(process.env.DATABASE_URL);
  var auth   = params.auth.split(':');

  // Assign new values to the existing config object.
  // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
  Object.assign(config, {
    user:     auth[0],
    password: auth[1],
    host:     params.hostname,
    port:     params.port,
    database: params.pathname.split('/')[1],
    ssl:      true // Required for Heroku, but not localhost!
  });
}

// Now we've got a pool that ought to work regardless of our environment.
const pool = new Pool(config);

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

// views is directory for all template files
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', function (request, response) {
    response.sendFile(__dirname + '/public/home.html');
});

app.get('/letter', function(request, response) {
  	response.sendFile(__dirname + '/public/letter.html');
});

app.get('/postage', function(req, res) {
	var weight = req.query.weight;
	var type = req.query.letterType;

	postage.calculateRate(weight, type, function(error, results) {
		res.render("pages/results", results);
	});
});

// Postgres getUser
app.get('/getUser', function(req, response){
  console.log(req.query.username);
	if (req.query.username != null) {
    email = req.query.username;
  }
  console.log('Email:', email);
	if (email) {
		pool.query('SELECT * FROM card WHERE email = \'' + email + '\'', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}
  		console.log('User Information:', res.rows[0]);
      response.render('pages/start', res.rows[0]);
		});
    } else {
		pool.query('SELECT * FROM card WHERE id = 1', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}
      email = res.rows[0].email;
      console.log(email);
  		console.log('Card:', res.rows[0]);
  		response.render('pages/start', Object.assign({}, res.rows[0]));
		});
	}
});

app.get('/editUser', function(req, response){
  console.log('Email:', email);
	if (email) {
    pool.query('UPDATE card SET name = \'' + req.query.name
     + '\', position = \'' + req.query.position
     + '\', phone = \'' + req.query.phone
     + '\', company = \'' + req.query.company
     + '\', address = \'' + req.query.address
     + '\', fax = \'' + req.query.fax
     + '\' WHERE email = \'' + email + '\';', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}

  		console.log('Card:', req.query);
  		response.render('pages/start', req.query);
  		response.end();
		});
	} else {
		pool.query('INSERT INTO card(email, position, name, phone, address, fax, templateid, company) VALUES ('
     + '\', \'' + req.query.email
     + '\', \'' + req.query.position
     + '\', \'' + req.query.name
     + '\', \'' + req.query.phone
     + '\', \'' + req.query.address
     + '\', \'' + req.query.fax
     + ', 1'
     + ', \'' + req.query.company
     + '\';', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}
      email = req.query.email;
  		console.log('Card:', req.query);
      response.render('pages/start', req.query);
  		response.end();
  });
	}
});

app.listen(app.get('port'), function() {
  	console.log('Node app is running on port', app.get('port'));
});
