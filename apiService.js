var http = require('http');
var addItems = require('./addItems');
var modFile = require('./modFile');
var deleteItem = require('./deleteItem');
var searchItem = require('./searchItem');

module.exports = function(app, workers)
{
	var fs = require('fs');
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

	// Sends the required information to AUTH.js
	function searchSend(data, property){
		var val = false;
		for(var key in workers["Employees"]){
			if(workers["Employees"][key][property]==data){
				reply = workers["Employees"][key];
				val = true;
				break;
			}
		}
		if(val) {
			var reply = workers["Employees"][key];	
		} else{
			var reply = {};
		}
		
		return reply;
	}
	module.exports.searchIt = searchSend;

	// Invalid call
	function replyInvalid(){
		var reply  = {
			msg : "Invalid Request",
			reason: "Try requesting with POST instead of GET."
		};
		return reply;
	}
	module.exports.replyInvalid = replyInvalid;

	app.route(["/add*","/del*"])
		.get(function(req, resp){
			resp.send(replyInvalid());
		})
		.put(function(req, resp){
			resp.send(replyInvalid());
		});

	app.route(["/add*","/mod*"])
		.delete(function(req, resp){
			resp.send(replyInvalid());
		});

	app.route("/del*","/mod*")
		.post(function(req, resp){
			resp.send(replyInvalid());
		});


	// Add Employee
	app.post("/add/:token/:name?/:lname?/:age?", addItems.add);

	// Modify the existing data
	app.put("/mod/:token/fname=:name?/fname=:fname?/lname=:lname?/age=:age?", modFile.mod);

	// Delete an employee
	app.delete("/del/:token/fname=:name?", deleteItem.del);


	// Search an employee
	app.get("/search/fname=:name?", searchItem.search);

	process.env.SECRET_KEY = "25asd9eqw3lp";
	var auth = require('./auth');
	
	// User key Authorize
	app.get("/auth/:fname", auth.authenticate);
}