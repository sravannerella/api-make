var index = require('./index');
var authorize = require('./authorize');
var writeJSONToFile = require('./writeJSONToFile');
var workers = index.workers;
var searchIt = require('./searchIt');

module.exports.search = function(req, resp){
	var data = req.params;
	var fname = data.name;
	var lname = data.lname;
	var age = Number(data.age);
	var reply = {};

	if(fname){
		var jsonVal = searchIt(fname, "fname");
		var val = jsonVal["val"];
		var key = jsonVal["key"];

		var reply = workers["Employees"][key];

		if(val){
			reply = {
				msg: "Name found",
				obj: reply
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
}