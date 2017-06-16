var http = require('http');
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
		})
		.delete(function(req, resp){
			resp.send(replyInvalid());
		})
		.post(function(req, resp){
			resp.send(replyInvalid());
		});

	// Search an employee
	app.get("/search/fname=:name?", searchItem.search);


	process.env.SECRET_KEY = "25asd9eqw3lp";
	var auth = require('./auth');
	
	// User key Authorize
	app.get("/auth/:fname", auth.authenticate);
}