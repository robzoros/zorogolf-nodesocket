var mongoose = require('mongoose'),  
	Schema   = mongoose.Schema;

mongoose.Promise = global.Promise
var campoSchema = new Schema({  
	_id: String ,
	hoyos:	[{
		_id: Number,
		recorrido: [],
		par: Number,
		green: {
			hexagonos: [],
			bandera: {
				hexagono: String,
				lugar: String
			}
		}
	}]
});

module.exports = mongoose.model('Campos', campoSchema); 