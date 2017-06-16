var index = require('./index');
var writeJSONToFile = require('./writeJSONToFile');
var searchIt = require('./searchIt');

module.exports.mod = function(req, resp){
	var workers = index.workers;
	var data = req.params;
	var name = data.name;
	var fname = data.fname;
	var lname = data.lname;
	var age = Number(data.age);
	var token = data.token;
	var reply = {};

	if(!name || !fname || !lname || !age){
		reply = {
			msg:"Invalid request."
		}
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
		} else{
			reply = {
				msg: "Name not found"
			};
		}
	}
	resp.send(reply);
	return true;
}