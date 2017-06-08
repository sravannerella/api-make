module.exports.authenticate = function(req, resp){
	var reply = {};

	var data = req.parameters;
	var key = req.key;

	reply = {
		key: key
	};

	resp.send(reply);
};