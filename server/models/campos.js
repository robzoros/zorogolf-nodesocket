var mongoose = require('mongoose'),  
	Schema   = mongoose.Schema;

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