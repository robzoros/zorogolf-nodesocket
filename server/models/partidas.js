var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var partidasSchema = new Schema({  
    _id:        Schema.Types.ObjectId,
    nombre:     String ,
    jugadorea:  [],
    campo:      String,
    hoyos:      [],
    eventos:    { 
                    descarte: { type: [] },
                    cartas: { type: [] }
                },
    hoyo_actual:  { 
                    "hoyo" : { type: Number},
                    "estado": { type: [] },
                    "orden" : { type: [Number] },
                    "accion_dado" : { type: Number }
                  }
});

module.exports = mongoose.model('Partidas', partidasSchema); 