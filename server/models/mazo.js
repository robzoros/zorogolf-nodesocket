var mongoose = require('mongoose'),  
	Schema   = mongoose.Schema;

mongoose.Promise = global.Promise
var mazoSchema = new Schema({  
	_id:	{ type: String },
	mazo:	[]
});

module.exports = mongoose.model('Mazo', mazoSchema); 