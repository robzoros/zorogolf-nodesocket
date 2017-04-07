var mongoose = require('mongoose'),  
	Schema   = mongoose.Schema;

var mazoSchema = new Schema({  
	_id:	{ type: String },
	mazo:	[]
});

module.exports = mongoose.model('Mazo', mazoSchema); 