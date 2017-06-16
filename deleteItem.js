var index = require('./index');
var writeJSONToFile = require('./writeJSONToFile');
var searchIt = require('./searchIt');

module.exports.del = function(req, resp){
	var workers = index.workers;
	var data = req.params;
	var fname = data.name;
	var token = data.token;
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
		} else{
			reply = {
				msg : "Name not found"
			}
		}
	} else{
		reply = {
			msg: "Invalid Request"
		}
	}
	resp.send(reply);
	return true;
}