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
var router = express.Router();
var jwt = require('jsonwebtoken');
var body = require('body-parser');

var addItems = require('./operations/addItems');
var modFile = require('./operations/modFile');
var deleteItem = require('./operations/deleteItem');

// Reading the file using File System and returns the buffer
var file = fs.readFileSync("data.json");

// Parses the file and converts into JSON objects in 
// workers variable
var workers = JSON.parse(file);

module.exports.workers = workers;

var app = express();

app.use(body.urlencoded({extended:true}));
app.use(body.json());
app.use("/api", router);

router.use(function(req, resp, next){
	var token = req.headers["token"];
	if(token){
		jwt.verify(token, process.env.SECRET_KEY, function(err, decode){
			if(err){
				resp.status(401).send({
					msg: "Token Expired or Invalid Token"
				});
			} else{
				next();
			}
		});

	} else{
		resp.status(400).send("Bad Request");
	}
});

// Add Employee
router.post("/emp", addItems.add);

// Modify the existing data
router.put("/emp", modFile.mod);

// Delete an employee
router.delete("/emp", deleteItem.del);

// API Calls
require('./auth/apiService')(app, workers);
