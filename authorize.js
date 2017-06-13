var http = require('http');

module.exports = function(token, callback){

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

};