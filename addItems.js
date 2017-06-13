var index = require('./index');
var authorize = require('./authorize');
var writeJSONToFile = require('./writeJSONToFile');
var workers = index.workers;

module.exports.add = function(req, resp) {
	var data = req.params;
	var fname = data.name;
	var lname = data.lname;
	var age = Number(data.age);
	var token = data.token;

	var reply;

	if(!fname || !lname || !age){
		reply = {
			msg:"Invalid request."
		}
		resp.send(reply);
	} else{

		authorize(token, function(result){

			if(result["msg"]=="verified"){
				workers["Employees"].push({
					fname: fname,
					lname: lname,
					age: age
				});

				writeJSONToFile('data.json', workers);

				reply = {
					msg:"Employee Added Successfully"
				}

				if(resp.statusCode == 200){
					resp.send(reply);
				}

			} else{
				reply = {
					msg:"Invalid request or key."
				}
				resp.send(reply);
			}
			return true;
		});
	}
};