var index = require('./index');
var authorize = require('./authorize');
var writeJSONToFile = require('./writeJSONToFile');
var workers = index.workers;
var searchIt = require('./searchIt');

module.exports.mod = function(req, resp){
	var data = req.params;
	var name = data.name;
	var fname = data.fname;
	var lname = data.lname;
	var age = Number(data.age);
	var token = data.token;
	var reply = {};

	authorize(token, function(result){
		if(!name || !fname || !lname || !age){
			reply = {
				msg:"Invalid request."
			}
		} else{
			if(result["msg"]=="verified") {

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
			} else{
				reply = {
					msg: "Invalid Request or key"
				};
			}
		}
		resp.send(reply);
		return true;
	});
}