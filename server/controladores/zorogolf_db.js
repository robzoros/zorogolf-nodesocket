var Partida = require('../models/partidas.js');
var Mazo    = require('../models/mazo.js');
var Campos  = require('../models/campos.js');
var User    = require('../models/user.js');
var jwt     = require('jwt-simple');
var config  = require('../config/database'); // get db config file
var Utiles  = require('../../shared/utiles')
var jsonfile = require('jsonfile')

var global;

var salvar = false
var mazoAccion = []
var mazoEventos = []
var mazoPalos = []
var campos = []

// *** Zorogolf ***
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

// *** Zorogolf ***
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

// *** Zorogolf ***
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

// *** Zorogolf ***
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

// *** Zorogolf ***
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

// *** Zorogolf ***
// Añadir partida
exports.addPartida = (dataIn) => {
	return new Promise ( (resolve, reject) => {
		nuevaPartida(dataIn.partida)
			.then((part) => {
				module.exports.addJugador({id: part._id, jugador: dataIn.jugador})
					.then((data) => { data.partida = part; resolve(data) })
					.catch((err) => { reject(err.message) })
			})
			.catch((err) => { reject(err.message) })
	})
}


// *** Zorogolf ***
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

// *** Zorogolf ***
// recupermos campos y guardamos en variable global
exports.getCampos = () => {
	Campos.find().exec()
		.then((lista) => {
			campos = lista
			//console.log("CAMPOS:", campos)
		})
		.catch((err) => { console.log(err.message)})
}

// *** Zorogolf ***
// recuperarPartida
exports.getPartida = (id) => {
	return new Promise ( (resolve, reject) => {
		Partida.findById(id).exec()
			.then((partida) => { resolve({success: true, partida}) })
			.catch((err) => { console.log(err.message)})
	})
}


// *** Zorogolf ***
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

// *** Zorogolf ***
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

// *** Zorogolf ***
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

// *** Zorogolf ***
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

// Funciones que llamarán en las promesas
actualizaPartida = function (req, res) {
	Partida.findById(req.params.id, function(err, partida) {
		if (err) {
			console.log(err);
			return res.status(500).send(err.message);
		}
		if (partida.usuario === req.body.usuario) {
			partida.nombre = req.body.nombre;
			partida.juego = req.body.juego;
			partida.loc = req.body.loc;
			partida.fecha = req.body.fecha;
			partida.jugadores = req.body.jugadores;
			partida.empresas = req.body.empresas;
			partida.dividendos = req.body.dividendos;

			partida.save(function(err){
				if (err) {
					console.log(err);
					return res.status(500).send(err.message);
				}
				res.status(200).jsonp(partida);
			});
		}
		else {
			console.log('La partida no pertenece al usuario.');
			return res.status(403).send('La partida no pertenece al usuario.');
		}
	});
};


nuevoJuego = (req, res) => {
	var juego = new Juego({
		_name:   	 req.body._name,
		_id:         req.body._id,
		description: req.body.description,
		companies:   req.body.companies
	});
	juego.save(function(err) {

		if (err) {
			console.log(err);
			return res.status(500).send( err.message);
		}
		res.status(200).jsonp(juego);
	}); 
};

deleteJuego = (req, res) => {
	console.log(req.params);
	var resp = res;
	Juego.findById(req.params.id, function(err, juego) {
		console.log(juego);
		juego.remove(function(err) {
			if (err) {
				console.log(err);
				return res.status(500).send(err.message);
			};
			console.log('Borrando');
			resp.status(200).send();
		});
	});
};
		
actualizarJuego = (req, res) => {
	var resp = res;
	Juego.findById(req.params.id, function(err, juego) {
		if (err) {
			console.log(err);
			return res.status(500).send( err.message);
		};
		juego._name = req.body._name;
		juego.description = req.body.description;
		juego.companies = req.body.companies;

		juego.save(function(err){
			if (err) {
				console.log(err);
				return resp.status(500).send( err.message);
			};
			res.status(200).jsonp(juego);
		});
	});
};

obtenerPartida = function (req, res) {
	Partida.findById(req.params.id, function(err, partida) {
		if(err){
			console.log(err);
			return res.status(500).send(err.message);
		}
		else {
			if (partida)
				res.status(200).jsonp(partida);
			else
				res.status(404).send("Partida no encontrada");
		}
	});
};

//CRUD Partidas
/*exports.addPartida = (req, res) => {
	verificarUsuario(req, res).then( function() {
		nuevaPartida(req, res);
	});
};

exports.getPartida = (req, res) => {  
	//verificarToken(req, res, false).then( function() {
		obtenerPartida(req, res);
	//});
};
*/

exports.putPartida = (req, res) => {
	verificarUsuario(req, res).then( function(){
		actualizaPartida(req, res);
	});
};

	
exports.borrarPartida = (req, res) => {
	var token = global.getToken(req.headers);
	if (token) {
		var decoded = jwt.decode(token, config.secret);

		Partida.findById(req.params.id, function(err, partida) {
			if (partida.usuario === decoded.name) {
				partida.remove(function(err) {
					if (err) {
						console.log(err);
						return res.status(500).send(err.message);
					};
					res.status(200).send();
				});
			}
			else {
				console.log('La partida no pertenece al usuario.');
				return res.status(403).send('La partida no pertenece al usuario.');
			}
		});
	}
	else {
		console.log('Authentication failed. Token not found.');
		return res.status(403).send('Authentication failed. Token not found.');
	};
	
};

//CRUD Juegos
exports.addJuego = (req, res) => {
	verificarToken(req, res, true).then( function () {
		nuevoJuego(req, res);
	});
};

exports.getJuegos = (req, res) => {
	//console.log('GET /juegos');
	
	Juego.find(function(err, juegos) {
		if (err) {
			console.log(err);
			return res.status(500).send(err.message);
		};
		res.status(200).jsonp(juegos);
	});
};

exports.getJuego = (req, res) => {
	//console.log('GET /juego id: ' +req.params.id);
	
	Juego.findById(req.params.id,function(err, juego) {
		if (err) {
			console.log(err);
			return res.status(500).send(err.message);
		};
		if (juego)
			res.status(200).jsonp(juego);
		else
			res.status(404).send("Juego no encontrado");
	});
};

exports.putJuego = (req, res) => {
	verificarToken(req, res, true).then(function() {
		actualizarJuego(req, res);
	});
};
	
exports.borrarJuego = (req, res) => {
	verificarToken(req, res, true).then( function() {
		deleteJuego(req, res);
	});
};

//*************************************************
// Salvar documento to file
//************************************************
exports.salvarDocumento = (nombre, fichero) => {
	if (!salvar) return null
	Partida.findOne( {nombre: nombre} ).exec()
		.then((partida) => {
			console.log("escribir doc %s con nombre %s en fichero %s", partida._id, nombre, fichero)
			jsonfile.writeFile(fichero, partida, {spaces: 2}, function(err) {
			  console.error(err)
			})
			
		})
		.catch((err) => {console.log(err)})
}