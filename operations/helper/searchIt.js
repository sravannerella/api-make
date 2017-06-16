var index = require('./../../index');

module.exports = function (data, property){
	var workers = index.workers;
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