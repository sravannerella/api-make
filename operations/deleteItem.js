var index = require('../index');
var writeJSONToFile = require('./helper/writeJSONToFile');
var searchIt = require('./helper/searchIt');

module.exports.del = function(req, resp){
	var workers = index.workers;
	var data = req.body;
	var fname = data.fname;
	var reply = {};

	// Name is given
	if(fname){
		var jsonVal = searchIt(fname, "fname");
		var key = jsonVal["key"];
		var val = jsonVal["val"];
	
		// Splices the array by the key as index and deletes the element
		workers["Employees"].splice(key,1);
		writeJSONToFile('data.json', workers);

		if(val){
			reply = {
				msg: "Name deleted"
			}
			resp.status(202).send(reply);
		} else{
			reply = {
				msg : "Name not found"
			}
			resp.status(202).send(reply);
		}
	} else{
		reply = {
			msg: "Invalid Request"
		}
		resp.status(401).send(reply);
	}

	return true;
}