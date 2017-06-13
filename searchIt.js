var index = require('./index');
var workers = index.workers;

module.exports = function (data, property){
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