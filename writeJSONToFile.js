var fs = require('fs');

module.exports  = function(file, data){
	var wData = JSON.stringify(data,null, 2);
	fs.writeFile(file,wData);
}