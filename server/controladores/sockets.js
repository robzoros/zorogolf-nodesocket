var socket_msg = require('../../shared/server_const')
var controller = require("./game_controller")

module.exports = (io) => {

	console.log("Esperando Conexiones via Socket.io")
	io.on('connection', (socket) => {
		socket.on(socket_msg.CONECTADO, (data) => {
			console.log(new Date() + ': Socket conectado:    ', socket.id)
			socket.emit(socket_msg.LOGIN_TOKEN, 'ok')
			socket.join("SALA PARTIDAS")
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

		// PRUEBAS DE SALA
		socket.on("MENSAJE", (data) => {
			console.log("MENSAJE: ", data, socket.id)
			console.log("Salas: ", io.sockets.adapter.rooms)
			socket.to("SALA PARTIDAS").emit("MENSAJE", "SOCKET TO: " + socket.id)
			io.in("SALA PARTIDAS").emit("MENSAJE", "IO IN: " + socket.id)
		})

		// PRUEBAS SALVANDO PARTIDA
		socket.on("SALVAR", (id) => {
			console.log("SALVAR: ", id, socket.id)
		    controller.salvar(id)
		})

		// PRUEBAS SALVANDO PARTIDA
		socket.on("EJECUTAR", (data) => {
			console.log("EJECUTAR: ", data, socket.id)
		    controller.ejecutar(data)
		})
		
		
		// Tratar peticiones
		controller.processMessage(socket, socket_msg.LOGIN, io)
		controller.processMessage(socket, socket_msg.TOKEN, io)
		controller.processMessage(socket, socket_msg.NUEVO_USUARIO, io)
		controller.processMessage(socket, socket_msg.PARTIDAS, io)
		controller.processMessage(socket, socket_msg.NUEVA_PARTIDA, io)
		controller.processMessage(socket, socket_msg.NUEVO_JUGADOR, io )
		controller.processMessage(socket, socket_msg.CARGAR_PARTIDA, io )
		controller.processMessage(socket, socket_msg.ACTUALIZAR_JUGADOR, io )
		controller.processMessage(socket, socket_msg.ACCION_JUGADOR, io )
		controller.processMessage(socket, socket_msg.ACCION_PREVIA, io )
		
	})
	
	// Inicializamos controller.
	controller.init()

	
}

