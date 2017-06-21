function calculateRate(weight, type, callback) {
	var weightPrice;
	var numWeight = Number(weight);

	if (type == "stamped") {
		weightPrice = .49;
		if (numWeight > 1 && numWeight < 3.5) {
			numWeight -= 1;
			numWeight *= 0.21;
			weightPrice += numWeight;
			weightPrice = Math.round(weightPrice*100)/100;
		} else if (numWeight >= 3.5) {
			weightPrice = 1.12;
		}
	} else if (type == "metered") {
		weightPrice = .46;
		if (numWeight > 1 && numWeight < 3.5) {
			numWeight -= 1;
			numWeight *= .21;
			weightPrice += numWeight;
			weightPrice = Math.round(weightPrice*100)/100;
		} else if (numWeight >= 3.5) {
			weightPrice = 1.09;
		}
	} else if (type == "flat") {
		weightPrice = .98;
		if (numWeight > 1 && numWeight <= 13) {
			numWeight -= 1;
			numWeight *= .21;
			weightPrice += numWeight;
			weightPrice = Math.round(weightPrice*100)/100;
		} else if (numWeight > 13) {
			weightPrice = 3.50;
		}
	} else if (type =="parcel") {
		weightPrice = 2.67;
		if (numWeight > 4 && numWeight <= 13) {
			numWeight -= 1;
			numWeight *= .18;
			weightPrice += numWeight;
			weightPrice = Math.round(weightPrice*100)/100;
		} else if (numWeight > 13) {
			weightPrice = 4.29;
		}
	} else {
		console.log("Invalid input somehow...");
	}

	var params = {
		weight: weight,
		type: type,
		weightPrice: weightPrice
	};

	callback(null, params);
}

module.exports = {calculatePostage: calculatePostage};