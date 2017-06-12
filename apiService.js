var http = require('http');

module.exports = function(app, workers){
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

	function authorize(token, callback){

		var options = {
		  "method": "GET",
		  "hostname": "localhost",
		  "port": "8009",
		  "path": "/checkauth",
		  "headers": {
		    "token": token,
		    "cache-control": "no-cache"
		  }
		};

		return http.request(options, function(res){
			var result = '';			
			res.on("data", function(chunk){
				result += chunk;
			});

			res.on("end", function(){
				var body = JSON.parse(result);
				callback(body);
			});

		}).end();

	}

	function searchIt(data, property){

		var val = false;
		for(var key in workers["Employees"]){
			if(workers["Employees"][key][property]==data){
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

	// Sends the required information
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

	function writeJSONToFile(file, data){
		var wData = JSON.stringify(data,null, 2);
		fs.writeFile(file,wData);
	}

	function replyInvalid(){
		var reply  = {
			msg : "Invalid Request",
			reason: "Try requesting with POST instead of GET."
		};
		return reply;
	}

	app.route(["/add*","/mod*","/del*"])
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

	app.route("/del*")
		.post(function(req, resp){
			resp.send(replyInvalid());
		});


	// Add Employee
	app.post("/add/:token/:name?/:lname?/:age?", function(req, resp){
		//Gives the Required parameters
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
	});

	// Modify the existing data
	app.post("/mod/:token/fname=:name?/fname=:fname?/lname=:lname?/age=:age?", function(req, resp){
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
				if(result["msg"]=="verified"){
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
	});

	// Delete an employee
	app.delete("/del/:token/fname=:name?", function(req, resp){
		var data = req.params;
		var fname = data.name;
		var token = data.token;
		var reply = {};

		// Name is given
		authorize(token, function(result){

			if(fname){	
				console.log(result);

				if(result["msg"]=="verified"){
					var val = false;
					var jsonVal = searchIt(fname, "fname");
					var key = jsonVal["key"];
					var val = jsonVal["val"];
				
					// Splices the array by the key as index and deletes the element
					workers["Employees"].splice(key,1);
					writeJSONToFile('data.json', workers);

					if(val){
						reply = {
							msg: "Name deleted"
						}
					} else{
						reply = {
							msg : "Name not found"
						}
					}
				} else{
					reply = {
						msg: "Invalid Request or key"
					};
				}
			} else{
				reply = {
					msg: "Invalid Request"
				}
			}
			resp.send(reply);
			return true;
		});
	});


	// Search an employee
	app.get("/search/fname=:name?", function(req, resp){
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

	process.env.SECRET_KEY = "25asd9eqw3lp";
	var auth = require('./auth');
	// User key Authorize
	app.get("/auth/:fname", auth.authenticate);
}