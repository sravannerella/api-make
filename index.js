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

// Reading the file using File System and returns the buffer
var file = fs.readFileSync("data.json");

// Parses the file and converts into JSON objects in 
// workers variable
var workers = JSON.parse(file);
var app = express();

// API Calls
require('./apiService')(app, workers);
