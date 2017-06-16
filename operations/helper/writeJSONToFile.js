module.exports  = function(file, data){
	var fs = require('fs');
	var wData = JSON.stringify(data, null, 2);
	var nData = wData;
	fs.writeFile(file, nData, function(err){
		if (err) {
			console.log(err);
		}
	});
}