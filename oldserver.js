app.get('/math', function(req, res) {
	res.sendFile(__dirname + '/public/static.html');
});

app.post('/math', function(req, res) {
	calculate(req.body.num1, req.body.num2, req.body.symbol, showResult);
	function showResult(err, result) {
		if (err == null) {
			res.render('public/results');
			
		}
		else {
			res.sendFile(__dirname + '/public/static.html');
		}
	}
});

function calculate(num1, num2, symbol, callback) {
	num1 = parseInt(num1);
	num2 = parseInt(num2);

	if (symbol == "Add") {
		callback(null, num1 + num2);
		return;
	}
	else if (symbol == "Subtract") {
		callback(null, num1 - num2);
		return;
	}
	else if (symbol == "Divide") {
		callback(null, num1 / num2);
		return;
	}
	else if (symbol == "Multiply") {
		callback(null, num1 * num2);
		return;
	}
	else {
		callback("Unable to finish request", "Invalid");
		return;
	}
};
