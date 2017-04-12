var socket_msg = require('../../shared/socket_const')
var controller = require("./game_controller")

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
		
		// Unirse a una sala
		socket.on(socket_msg.JOIN_ROOM, (data) => {
			console.log("Join Sala: %s - Socket: %s", data.id, socket.id)
			controller.leaveRooms(socket)
			socket.join(data.id)
		})

		// Tratar peticiones
		controller.processMessage(socket, socket_msg.LOGIN,  io)
		controller.processMessage(socket, socket_msg.TOKEN,  io)
		controller.processMessage(socket, socket_msg.NUEVO_USUARIO, io)
		controller.processMessage(socket, socket_msg.PARTIDAS,  io)
		controller.processMessage(socket, socket_msg.NUEVA_PARTIDA, io)
		controller.processMessage(socket, socket_msg.NUEVO_JUGADOR, io )
		controller.processMessage(socket, socket_msg.CARGAR_PARTIDA, io )
		controller.processMessage(socket, socket_msg.ACTUALIZAR_JUGADOR, io )
		
	})
	
	// Inicializamos controller.
	controller.init()

	
}

