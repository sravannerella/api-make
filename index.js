/*
 * API Creation
 * 
 * Use a JSON file as a database 
 * add Employee -> adds an element to the database
 * del Employee -> deletes an element to the database
 * search Employee -> searches through the array and prints the result 
 *
 *
 */

// Library variables
var express = require("express");
var fs = require("fs");

// Reading the file using File System
var file = fs.readFileSync("data.json");
// Parses the file and converts into JSON objects in 
// workers variable
var workers = JSON.parse(file);
var app = express();

// Server creation
app.listen(8009, function() {
	console.log("Server is Running");
});

// On user Entry
app.get("/", function(req, resp){
	if(resp.statusCode == 200){
		resp.send(workers);
	}
});

function searchIt(fname){
	var val = false;
	for(var key in workers["Employees"]){
		if(workers["Employees"][key]["fname"]==fname){
			reply = workers["Employees"][key];
			val = true;
			break;
		}
	}
	var reply = {
		key : key,
		val : val
	};

	return reply;
}

function writeJSONToFile(file, data){
	var wData = JSON.stringify(data,null, 2);
	fs.writeFile(file,wData);
}

// Add Employee
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

		writeJSONToFile('data.json', workers);

		reply = {
			msg:"Employee Added Successfully"
		}

		if(resp.statusCode == 200){
			resp.send(workers);
		}
	}
});


app.get("/mod/fname=:name?/fname=:fname?/lname=:lname?/age=:age?", function(req, resp){
	var data = req.params;
	var name = data.name;
	var fname = data.fname;
	var lname = data.lname;
	var age = Number(data.age);
	var reply = {};

	if(!name || !fname || !lname || !age){
		reply = {
			msg:"Invalid request."
		}
	} else{
		var jsonVal = searchIt(name);
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
});

// Delete an employee
app.get("/del/fname=:name?", function(req, resp){
	var data = req.params;
	var fname = data.name;
	var lname = data.lname;
	var age = Number(data.age);
	var reply = {};

	// Name is given
	if(fname){
		var val = false;

		var jsonVal = searchIt(fname);
		var key = jsonVal["key"];
		var val = jsonVal["val"];

		// Splices the array by the key as index and deletes the element
		workers["Employees"].splice(key,1);
		writeJSONToFile('data.json', workers);

		if(val){
			reply = {
				msg: "Name deleted",
				obj: workers
			}
		} else{
			reply = {
				msg : "Name not found"
			}
		}
	}
	// Name not given 
	else{
		reply = {
			msg: "Invalid Request"
		}
	}
	resp.send(reply);
});


// Search an employee
app.get("/search/fname=:name?", function(req, resp){
	var data = req.params;
	var fname = data.name;
	var lname = data.lname;
	var age = Number(data.age);
	var reply = {};

	if(fname){
		var jsonVal = searchIt(fname);
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
});