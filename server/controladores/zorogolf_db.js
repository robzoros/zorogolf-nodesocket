var Partida = require('../models/partidas.js');
var Mazo    = require('../models/mazo.js');
var Campos  = require('../models/campos.js');
var User    = require('../models/user.js');
var jwt     = require('jwt-simple');
var config  = require('../config/database'); // get db config file
var Utiles  = require('../../shared/utiles')
var jsonfile = require('jsonfile')

var global;

const PATH = "/home/ubuntu/pruebas/"
var mazoAccion = []
var mazoEventos = []
var mazoPalos = []
var campos = []

// ********************************************************************
//				Autenticación Usuarios
// ********************************************************************
// Promesa para verificar usuario
function verificarUsuario (nombre) {
	return new Promise ( (resolve, reject) => {
		User.findOne({name: nombre}, (err, user) => {
			if (err) {
				console.log(err);
				reject (err.message);
			}

			if (!user) {
				console.log('Authentication failed. User not found.');
				reject('Authentication failed. User not found.');
			} 
			else {
				resolve(user);
			}
		});
	});
}

// Crear usuario y Password
exports.crearUsuario = (data) => {
	return new Promise ( (resolve, reject) => {
		if (!data.name || !data.password) {
			reject({success: false, msg: 'Please send name and password.'})
		} 
		else {
			var newUser = new User({
				name: data.name,
				password: data.password,
				email: data.email,
				rol: "Consulta"
			})
	
			// save the user
			newUser.save((err, usuario) => {
				if (err) {
					reject({success: false, msg: 'Username already exists.'})
				}
				var token = 'JWT ' + jwt.encode(usuario, config.secret);
				var name = usuario.name
				var rol = usuario.rol
				resolve({success: true, token, name, rol});
			});
		}
	})
};

// Comprobar usuario y Password
exports.login = (datos) => {
	return new Promise ( (resolve, reject) => {
		verificarUsuario(datos.name)
			.then((usuario) => {
				// check if password matches
				usuario.comparePassword(datos.password, (err, isMatch) => {
					if (isMatch && !err) {
						// if user is found and password is right create a token
						var token = 'JWT ' + jwt.encode(usuario, config.secret);
						// return the information including token as JSON
						resolve ({success: true, token, name: usuario.name, rol: usuario.rol});
					} else {
						console.log('Not Compare Pass', err);
						reject('Authentication failed. Wrong password. ');
					}
				})
			})
			.catch((err) => { reject(err) })
	})
}

// Promesa para verificar token
exports.verificarToken = (token) => {
	return new Promise ( (resolve, reject) => {
		if (token) {
			var decoded = jwt.decode(token.split(' ')[1], config.secret);
			verificarUsuario(decoded.name)
				.then(() => { resolve ({ success: true, token, name: decoded.name }) })
				.catch((err) => { reject(err) })
		}
		else {
			console.log('Authentication failed. Token not found.');
			reject('Authentication failed. Token not found.');
		}
	});

};
// ********************************************************************
//				FIN Autenticación Usuarios
// ********************************************************************

// ********************************************************************
//				CONSULTAS
// ********************************************************************
// Obtener partidas no acabadas
exports.getListaPartidas = (data) => {
	return new Promise ( (resolve, reject) => {
		var token = data.token.split(' ');
		var nombre = data.name
		if (token) {
			//var decoded = jwt.decode(token, config.secret);
			Partida.find({ $or: [ 
				{
					jugadores: {$not: {$elemMatch: {nombre: nombre}}}, 
					"jugadores.3": {$exists: false}
				},
				{ "jugadores.nombre": nombre }
				]
			}, (err, partidas) => {
				if(err){
					console.log(err);
					reject(err.message);
				}
				resolve({success: true, partidas});
			});
		}
		else {
			console.log('Authentication failed. Token not found.');
			reject('Authentication failed. Token not found.');
		}
	})
};

// recupermos mazos y guardamos en variable global
exports.getMazos = () => {
	Mazo.find().exec()
		.then((lista) => {
			mazoAccion = lista.filter((o) => {return o._id == 'accion'})[0].mazo
			mazoPalos = lista.filter((o) => {return o._id == 'palos'})[0].mazo
			mazoEventos = lista.filter((o) => {return o._id == 'eventos'})[0].mazo
			//console.log("MAZOS:", mazoAccion, mazoPalos, mazoEventos)
		})
		.catch((err) => { console.log(err.message)})
}

// recupermos campos y guardamos en variable global
exports.getCampos = () => {
	Campos.find().exec()
		.then((lista) => {
			campos = lista
			//console.log("CAMPOS:", campos)
		})
		.catch((err) => { console.log(err.message)})
}

// recuperarPartida
exports.getPartida = (id) => {
	return new Promise ( (resolve, reject) => {
		Partida.findById(id).exec()
			.then((partida) => { resolve({success: true, partida}) })
			.catch((err) => { console.log(err.message)})
	})
}
// ********************************************************************
//				FIN CONSULTAS
// ********************************************************************

// Añadir partida
exports.addPartida = (dataIn) => {
	return new Promise ( (resolve, reject) => {
		nuevaPartida(dataIn.partida)
			.then((partida) => { return module.exports.addJugador({id: partida._id, jugador: dataIn.jugador})	})
			.then((data) => { resolve(data) })
			.catch((err) => { reject(err.message) })
	})
}


// Añadimos un jugador a la partida
exports.addJugador = (data) => {
	return new Promise ( (resolve, reject) => {
		var jugador = data.jugador
		var status = { estado: "STROKE", golpesHoyo:0 }
		jugador.mazo_accion = { descarte: [], cartas: mazoAccion }
		jugador.palos = mazoPalos
		jugador.golpes = 0
		jugador.progreso = 10
		jugador.status = status
		Partida.findByIdAndUpdate(data.id, {$push: {jugadores: jugador}}, {new: true}, (err, partida) => {
			if(err){
				console.log(err);
				reject(err.message);
			}
			resolve({success: true, partida, jugador});
		})
	} )

};

// Iniciamos partida añadiendo
// - Campo
// - Mazo Eventos
// - Mazo Barajado
// - Hoyo actual
exports.initPartida = (id, nombre) => {
	return new Promise ( (resolve, reject) => {
		
		var campo = campos.filter((c) => {return c._id === nombre})[0]
		var mazo = Utiles.shuffleDeck(mazoEventos, [])
	    var hoyoActual = {hoyo: 1, estado: ['G', 'G', 'G', 'G']}
	    Partida.findByIdAndUpdate(id, {$set: {campo: nombre, hoyos: campo.hoyos, eventos: { descarte: [], cartas: mazo}, hoyo_actual: hoyoActual}}, {new: true})
	    	.then((partida) => {
	    		resolve({success: true, partida})
	    	})
	    	.catch( (err) => { reject(err.message) })
	})

}

// Actualizamos estado y jugador
exports.setJugadorEstado = (datos) => {
	return new Promise ( (resolve, reject) => {
		var estado_jugador_key = "hoyo_actual.estado." + datos.jugador_indice
		var objetoActualizar =  {"jugadores.$": datos.jugador}
		objetoActualizar[estado_jugador_key] = datos.status_hoyo
		Partida.findOneAndUpdate( 
			{ _id: datos.id, "jugadores.nombre": datos.jugador.nombre}, 
			{ $set: objetoActualizar},
			{ "new": true } )
	    	.then((partida) => {
	    		resolve({success: true, partida})
	    	})
	    	.catch( (err) => { reject(err.message) })
	})
}

// Actualizamos estado y jugadores
exports.setJugadoresEstado = (datos) => {
	return new Promise ( (resolve, reject) => {
		Partida.findByIdAndUpdate( 
			datos.id, 
			{ $set: { jugadores: datos.jugadores, hoyo_actual: datos.hoyo_actual } },
			{ "new": true } )
	    	.then((partida) => {
	    		resolve({success: true, partida})
	    	})
	    	.catch( (err) => { reject(err.message) })
	})
}

// Actualizamos Partida
exports.actualizaPartida = (data) => {
	return new Promise ( (resolve, reject) => {
		Partida.findByIdAndUpdate( data.id, 
			{ $set: data},
			{ "new": true } )
	    	.then((partida) => {
	    		resolve(partida)
	    	})
	    	.catch( (err) => { reject(err.message) })
	})
}

// Creamos una partida nueva
var nuevaPartida = (partida) => {
	// Creamos partida
	var part = new Partida({
		nombre:   	partida.nombre,
		jugadores:  partida.jugadores,
		campo:    	partida.campo
	})
	return part.save() 
};


//*************************************************
// Salvar documento to file
//************************************************
exports.salvarDocumento = (id) => {
	Partida.findById( id ).exec()
		.then((partida) => {
			var nombre = partida.nombre.replace(/ /g, "_")
			var fecha = (new Date()).toISOString().slice(0,19).replace(/[-:T]/g,"")
			var fichero = PATH + fecha + nombre + ".json"
			console.log("escribir doc %s con nombre %s en fichero %s", partida._id, partida.nombre, fichero)
			jsonfile.writeFile(fichero, partida, {spaces: 2}, function(err) { console.log(err) })
			
		})
		.catch((err) => {console.log(err)})
}