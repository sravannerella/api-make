var jwt = require('jsonwebtoken');
var service = require('./apiService');

module.exports.authenticate = function(req, resp) {

	var data = req.params;
	var fname = data.fname;

	var user = service.searchIt(fname, "fname");
	if(JSON.stringify(user)=='{}'){
		resp.send({
			success: false,
			msg: "User not found"
		});
	} else {
		var token = jwt.sign(user, process.env.SECRET_KEY,{expiresIn: 4000});
	
		resp.send({
			success: true,
			token: token
		});
	}

};