var index = require('../index');
var writeJSONToFile = require('./helper/writeJSONToFile');

module.exports.add = function(req, resp) {
	var workers = index.workers;

	var data = req.body;

	var fname = data.fname;
	var lname = data.lname;
	var age = Number(data.age);

	var reply;

	if(!fname || !lname || !age){
		reply = {
			msg:"Invalid request."
		}
		resp.status(401).send(reply);
	} else{
		workers["Employees"].push({
			fname: fname,
			lname: lname,
			age: age
		});

		writeJSONToFile('data.json', workers);

		reply = {
			msg:"Employee Added Successfully"
		}
		resp.status(201).send(reply);
	}
	return true;
};