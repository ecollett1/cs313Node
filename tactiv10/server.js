var express = require('express');
var app = express();
var bodyParser = require('body-parser');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'familyhistory',
  password: 'sh0m0mm@',
  port: 5432
});

app.set('port', (process.env.PORT || 5000));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true}));

app.get('/getPerson', function(req, response){
	var id = req.query.id;
	if (id) {
		pool.query('SELECT * FROM person WHERE id = ' + id, (err, res) => {
	  	if (err) {
	    	throw err;
	  	}
		
		console.log('Person:', res.rows);
		response.send(JSON.stringify(res.rows));
		response.end();
		});
	} else {
		pool.query('SELECT * FROM person', (err, res) => {
	  	if (err) {
	    	throw err;
	  	}
		
		console.log('Person:', res.rows);
		response.send(JSON.stringify(res.rows));
		response.end();
		});
	}
});

app.listen(app.get('port'), function() {
  	console.log('Node app is running on port', app.get('port'));
});