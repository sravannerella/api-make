var index = require('../index');
var searchIt = require('./helper/searchIt');

module.exports.search = function(req, resp){
	var workers = index.workers;
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