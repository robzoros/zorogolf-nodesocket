var socket_msg = require('../../shared/socket_const')
var zorogolf_db = require('./zorogolf_db')

var getRequest = (message) => {
    switch (message) {
		case socket_msg.LOGIN:
		    return zorogolf_db.login
		case socket_msg.TOKEN:
		    return zorogolf_db.verificarToken
		case socket_msg.NUEVO_USUARIO:
		    return zorogolf_db.crearUsuario
		case socket_msg.PARTIDAS:
		    return zorogolf_db.getListaPartidas
		case socket_msg.NUEVA_PARTIDA:
		    return zorogolf_db.addPartida
		case socket_msg.CARGAR_PARTIDA:
		    return zorogolf_db.getPartida
		case socket_msg.ACTUALIZAR_JUGADOR:
		    return zorogolf_db.setJugadorEstado
		case socket_msg.NUEVO_JUGADOR:
		    return processNewPlayer
        default:
            // code
            return null
    }

}

var simpleRequest = (socket, io, request, message, dataMsg, broadcast, broadcastMessage, newRoom) => {
	request(dataMsg)
    	.then((data) => {
    		if (broadcast)
    			io.emit(broadcastMessage, data)
    		if (newRoom){
    			exports.leaveRooms(socket)
    			socket.join(data.partida._id)
    		}
    		socket.emit(message, data)
    	})
    	.catch((data)=> {
    		console.log(message)
    		socket.emit(message, data)
    	})

}

var processSimpleMessage = (socket, message, io) => {
	var broadcast = message === socket_msg.NUEVA_PARTIDA ? true : false
	var newRoom = message === socket_msg.NUEVA_PARTIDA ? true : false
	var broadcastMessage = message === socket_msg.NUEVA_PARTIDA ? socket_msg.PARTIDAS_NUEVAS : ""

	socket.on(message, (dataMsg) => {
		console.log(message + ": " + socket.id)
		simpleRequest(socket, io, getRequest(message), message, dataMsg, broadcast, broadcastMessage, newRoom)
	})
}

// Añadimos nuevo jugador
// Si es el cuarto jugaodor iniciamos partida
var processNewPlayer = (socket, message, io) => {
	socket.on(message, (dataMsg) => {
	    console.log(message, dataMsg)
        zorogolf_db.addJugador(dataMsg)
    		.then((data) => {
        		if(!socket.rooms[data.partida._id]) {
        			exports.leaveRooms(socket)
        			socket.join(data.partida._id)
        		}
        		io.in(data.partida._id).emit(socket_msg.NUEVO_JUGADOR, data)
        		io.emit(socket_msg.PARTIDAS_NUEVAS, data)
        		if (data.partida.jugadores.length === 4) {
        		    zorogolf_db.initPartida(data.partida._id, "Zorocampo")
        		        .then( (dataPartida) => {
        		            io.in(dataPartida.partida._id).emit(socket_msg.EMPEZAR_PARTIDA, dataPartida)
        		        })
        		        .catch( (err) => {
                    		console.log("Iniciar partida: ", err)
        		        })
        		}
        	})
        	.catch((data)=> {
        		console.log(socket_msg.NUEVO_JUGADOR + " error: ", data)
        		socket.emit(socket_msg.NUEVO_JUGADOR, data)
        	})
	})
}

exports.processMessage = (socket, message, io) => {
    switch (message) {
		case socket_msg.LOGIN:
		case socket_msg.TOKEN:
		case socket_msg.NUEVO_USUARIO:
		case socket_msg.PARTIDAS:
		case socket_msg.NUEVA_PARTIDA:
		case socket_msg.CARGAR_PARTIDA:
		    processSimpleMessage(socket, message, io)
		    break
		case socket_msg.ACTUALIZAR_JUGADOR:
		    processRoomMessage(socket, message, zorogolf_db.setJugadorEstado, io)
		    break
		case socket_msg.NUEVO_JUGADOR:
		    processNewPlayer(socket, message, io)
		    break
        default:
		    processSimpleMessage(socket, message, io)
    }
}


var processRoomMessage = (socket, message, peticion, io) => {
	socket.on(message, (msg) => {
	    console.log(message + ": ", socket.id)
		peticion(msg)
			.then((data) => {
				if(!socket.rooms[data.partida._id]) {
					exports.leaveRooms(socket)
					socket.join(data.partida._id)
				}
				io.in(data.partida._id).emit(message, data)
			})
			.catch((data)=> {
				console.log(message + " error: ", data)
				socket.emit(message, data)
			})
	})
}

// Deja todas las salas menos la propia
exports.leaveRooms = (socket) => {
	Object.keys(socket.rooms).forEach( (key) => {
		if (key !== socket.id) socket.leave(key)
	});
}

// Inicializamos controller
exports.init = () => {
	// Se recogen los mazos para tenerlos en memoria
    zorogolf_db.getMazos()
    zorogolf_db.getCampos()
    zorogolf_db.salvarDocumento("Prueba alta", "/home/ubuntu/pruebas/prueba.json")
}