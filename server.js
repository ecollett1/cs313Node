var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var postage = require('./postage.js');
const { Pool } = require('pg');
const path = require('path');
var id;
var pg = require('pg');

// pg.defaults.ssl = true;
var row1;

// pg.connect(process.env.DATABASE_URL, function(err, client) {
//   if (err) throw err;
//   console.log('Connected to postgres! Getting schemas...');
//
//   client
//     .query('SELECT *FROM card WHERE id = 1;')
//     .on('row', function(row) {
//       row1 = row;
//       console.log(JSON.stringify(row));
//     });
// });


// This will work locally, but not at Heroku. We need something like the following:
// https://github.com/brianc/node-pg-pool#note
/*
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'businesscard',
  password: 'sh0m0mm@',
  port: 5432
});
*/

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
app.set('views', path.join(__dirname, '/views')); // Good! It wouldn't hurt to
                                                  // do this for the other
                                                  // __dirname + path lines,
                                                  // for consistency's sake.

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
  // Sending the row here will give you "Cannot modify headers after already
  // sent" error. That's a fatal one, which is partly why your page won't load.
  //response.send(row1);
	var email = req.query.username;
  console.log('Email:', email);
	if (email) {
		pool.query('SELECT * FROM card WHERE email = \'' + email + '\'', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}
      id = res.rows[0].id;
		console.log('User Information:', res.rows[0]);
    response.render('pages/start', res.rows[0]);
		response.end();
		});
    // pg.connect(process.env.DATABASE_URL, function(err, client) {
    //   if (err) throw err;
    //   console.log('Connected to postgres! Getting schemas...');
    //
    //   client.query('SELECT * FROM card WHERE email = \';' + email + '\'').on('row', function(row) {
    //         console.log(JSON.stringify(row));
    //         response.render('pages/start');
    //       });
    //   });
    } else {
    // I don't have card #2 in the database.sql file, so I changed this to card #1.
		pool.query('SELECT * FROM card WHERE id = 1', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}

		console.log('Card:', res.rows[0]);
    // For reference, Object.assign copies the properties of all arguments onto
    // the first argument. What I'm doing here is making a new object that has
    // the properties from the first row returned by your query, plus the
    // additional "company" property that your pages/start.ejs template expects
    // but that the database is missing.
    // Modifying the result of a database operation in-place can cause confusion
    // while debugging, so I'm basically making a copy instead!
		response.render('pages/start', Object.assign({}, res.rows[0], {
      company: 'This is missing in the database :('
    }));

    // Not technically necessary after response.render.
		// response.end();
		});
  //   pg.connect(process.env.DATABASE_URL, function(err, client) {
  //     if (err) throw err;
  //     console.log('Connected to postgres! Getting schemas...');
  //
  //   client.query('SELECT * FROM card WHERE id = 1;').on('row', function(row) {
  //     id = 1;
  //     console.log(JSON.stringify(row));
  //     response.render('pages/start');
  //   });
  // });
	}
});

// Heroku postgres
app.get('/getUser', function(req, response){
  // Is this ever executed?
  console.log('I don\'t think this ever appears...');
  // You've got two routes for GET /getUser, and the first one intercepts and
  // terminates requests long before this logic is ever executed.

  response.send(row1);
	var email = req.query.username;
  console.log('Email:', email);
	if (email) {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (err) { throw err };
      console.log('Connected to postgres! Getting schemas...');

      client.query('SELECT * FROM card WHERE email = \';' + email + '\'').on('row', function(row) {
            console.log(JSON.stringify(row));
            response.render('pages/start');
          });
      });
    } else {
    pg.connect(process.env.DATABASE_URL, function(err, client) {
      if (err) { throw err };
      console.log('Connected to postgres! Getting schemas...');

    client.query('SELECT * FROM card WHERE id = 1;').on('row', function(row) {
      id = 1;
      console.log(JSON.stringify(row));
      response.render('pages/start');
    });
  });
	}
});

app.get('/editUser', function(req, response){
  console.log('ID:', id);
	if (id) {
    pool.query('UPDATE card SET name = \'' + req.query.name
     + '\', position = \'' + req.query.business
     + '\', phone = \'' + req.query.phone
     + '\', company = \'' + req.query.company
     + '\', address = \'' + req.query.address
     + '\', fax = \'' + req.query.fax
     + '\' WHERE id = ' + id, (err, res) => {
	  	if (err) {
	    	throw err;
	  	}

		console.log('Card:', req.query);
		response.render('pages/start', req.query);
		response.end();
		});
	} else {
		pool.query('UPDATE card SET name = \'' + req.query.name
     + '\', position = \'' + req.query.business
     + '\', phone = \'' + req.query.phone
     + '\', company = \'' + req.query.company
     + '\', address = \'' + req.query.address
     + '\', fax = \'' + req.query.fax
     + '\' WHERE email = \'' + req.query.email + '\'', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}

		console.log('Card:', req.query);
    response.render('pages/start', req.query);
		response.end();
  });
	}
});

app.listen(app.get('port'), function() {
  	console.log('Node app is running on port', app.get('port'));
});
