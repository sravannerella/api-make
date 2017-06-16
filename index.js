/*
 * API Creation
 * 
 * Use a JSON file as a database 
 * add Employee -> adds an element to the database
 * del Employee -> deletes an element to the database
 * search Employee -> searches through the array and prints the result 
 *
 */

// Library variables
var express = require("express");
var fs = require("fs");
var secure = express.Router();
var jwt = require('jsonwebtoken');

var addItems = require('./addItems');
var modFile = require('./modFile');
var deleteItem = require('./deleteItem');

// Reading the file using File System and returns the buffer
var file = fs.readFileSync("data.json");

// Parses the file and converts into JSON objects in 
// workers variable
var workers = JSON.parse(file);

module.exports.workers = workers;

var app = express();

app.use("/checkauth", secure);

secure.use(function(req, resp, next){
	var token = req.headers["token"];
	if(token){
		jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
			if(err){
				resp.send({
					msg: "Invalid Key"
				});
			} else{
				next();
			}
		});

	} else{
		resp.send("NOPE");
	}
});

// Add Employee
secure.post("/add/:name?/:lname?/:age?", addItems.add);

// Modify the existing data
secure.put("/mod/fname=:name?/fname=:fname?/lname=:lname?/age=:age?", modFile.mod);

// Delete an employee
secure.delete("/del/fname=:name?", deleteItem.del);

// API Calls
require('./apiService')(app, workers);
