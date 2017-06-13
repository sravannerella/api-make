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

// Reading the file using File System and returns the buffer
var file = fs.readFileSync("data.json");

// Parses the file and converts into JSON objects in 
// workers variable
var workers = JSON.parse(file);

module.exports.workers = workers;

var app = express();

var auth = require('./auth');
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
				resp.send({
					msg: "verified"
				});
			}
		});

	} else{
		resp.send("NOPE");
	}
});

// API Calls
require('./apiService')(app, workers);
