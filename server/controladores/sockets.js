var socket_msg = require('../../shared/socket_const')
var zorogolf_db = require('./zorogolf_db')
var timeOut = 25000

var tratarPeticion = (socket, tipo, peticion, broadcast, io) => {
	// Broadcast not defined === false
	broadcast = typeof broadcast !== 'undefined' ? broadcast : false;
	socket.on(tipo, (msg) => {
		console.log(tipo + ": " + socket.id)
		peticion(msg)
			.then((data) => {
				if (broadcast)
					io.emit(tipo, data)
				else
					socket.emit(tipo, data)
			})
			.catch((data)=> {
				console.log(tipo + " error: ", data)
				socket.emit(tipo, data)
			})
	})
}


module.exports = (io) => {
	console.log("Esperando Conexiones via Socket.io")
	io.on('connection', (socket) => {
		socket.on(socket_msg.CONECTADO, (data) => {
			console.log(new Date() + ': Socket conectado:    ', socket.id)
			socket.emit(socket_msg.LOGIN_TOKEN, 'ok')
		})

		// Desconexión
		socket.on(socket_msg.DISCONNECT, () => {
			console.log(new Date() +  ': Socket desconectado:', socket.id)
		})

		// Tratar peticiones
		tratarPeticion(socket, socket_msg.LOGIN,  zorogolf_db.login)
		tratarPeticion(socket, socket_msg.TOKEN,  zorogolf_db.verificarToken)
		tratarPeticion(socket, socket_msg.NUEVO_USUARIO, zorogolf_db.crearUsuario)
		tratarPeticion(socket, socket_msg.PARTIDAS,  zorogolf_db.getListaPartidas)
		tratarPeticion(socket, socket_msg.NUEVA_PARTIDA, zorogolf_db.addPartida, true, io)
		tratarPeticion(socket, socket_msg.NUEVO_JUGADOR, zorogolf_db.addJugador, true, io)
		
	})
	
	// Se recogen los mazos para tenerlos en memoria
	zorogolf_db.getMazos()
}

