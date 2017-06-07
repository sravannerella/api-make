var workers = {
	Employees: [
		{
			fname: "Sravan",
			lname: "Nerella",
			age : 22
		}, 
		{
			fname: "Aditya",
			lname: "Nerella",
			age: 20
		}
	]
}

var express = require("express");
var app = express();

app.listen(8009, function() {
	console.log("Server is Running");
});

app.get("/", function(req, resp){
	if(resp.statusCode == 200){
		resp.send(workers);
	}
});

app.get("/add/:name?/:lname?/:age?", function(req, resp){
	//Gives the Required parameters
	var data = req.params;
	var fname = data.name;
	var lname = data.lname;
	var age = Number(data.age);

	var reply;

	if(!fname || !lname || !age){
		reply = {
			msg:"Invalid request."
		}
		resp.send(reply);
	} else{

		workers["Employees"].push({
			fname: fname,
			lname: lname,
			age: age
		});

		reply = {
			msg:"Employee Added Successfully"
		}

		if(resp.statusCode == 200){
			resp.send(workers);
		}
	}
});

// app.get(["/search*"], function(req, resp){
// 	var reply = {
// 		msg: "Invalid request"
// 	}
// 	resp.send(reply);
// });

app.get("/search/fname=:name?", function(req, resp){
	var data = req.params;
	var fname = data.name;
	var lname = data.lname;
	var age = Number(data.age);
	var reply = {};

	if(fname){
		var val = false;
		for(var key in workers["Employees"]){
			if(workers["Employees"][key]["fname"]==fname){
				reply = workers["Employees"][key];
				val = true;
				break;
			}
		}

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
});