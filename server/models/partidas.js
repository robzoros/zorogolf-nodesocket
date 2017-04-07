var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var partidasSchema = new Schema({  
    nombre:     String ,
    jugadores:  [],
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

module.exports = mongoose.model('Partida', partidasSchema); 