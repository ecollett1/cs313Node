var http = require('http');

function onRequest(req, res) {
	res.writeHead(200, {'Content-Type': 'text/html'});
	if (req.url == '/home') {
		res.writeHead(200, {"Content-Type": "text/html"});
		res.write("<h1>Welcome to the Home Page</h1>");
		res.end();
	}
	else if (req.url == '/getData') {
		res.writeHead(200, {"Content-Type": "application/json"});
		res.write(JSON.stringify({name: 'Eric Collett', class: 'cs313'}));
		res.end();
	}
	else {
		res.writeHead(404, {"Content-Type": "text/html"});
		res.write("<h1>Error: 404 - Page Not Found</h1>");
		res.end();
	}
}

http.createServer(onRequest).listen(8888);