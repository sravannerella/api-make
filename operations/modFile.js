var index = require('../index');
var writeJSONToFile = require('./helper/writeJSONToFile');
var searchIt = require('./helper/searchIt');

module.exports.mod = function(req, resp){
	var workers = index.workers;
	var data = req.body;
	var name = data.name;
	var fname = data.fname;
	var lname = data.lname;
	var age = Number(data.age);
	var reply = {};

	if(!name || !fname || !lname || !age){
		reply = {
			msg:"Invalid request."
		}
		resp.status(401).send(reply);
	} else{
		var jsonVal = searchIt(name, "fname");
		var key = jsonVal["key"];
		var val = jsonVal["val"];

		if(val){
			workers["Employees"][key]["fname"] = fname;
			workers["Employees"][key]["lname"] = lname;
			workers["Employees"][key]["age"] = age;

			writeJSONToFile('data.json', workers);

			reply = {
				msg: "Modified",
				obj: workers["Employees"][key]
			}
			resp.status(202).send(reply);
		} else{
			reply = {
				msg: "Name not found"
			};
			resp.status(202).send(reply);
		}
	}
	return true;
}