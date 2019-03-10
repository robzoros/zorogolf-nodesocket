import { browserHistory } from 'react-router'
import Store from './redux/store'
import * as Acciones from './redux/acciones-partidas'
import { saveUserCredentials } from './sesion'
import MENSAJES_SOCKET from '../../shared/server_const'

let socket

export function conectar() {
	//socket = io.connect('http://localhost:8080', { 'forceNew': true })
	//socket = io.connect('https://127.0.0.1:3100', { 'forceNew': true });
	if (!socket) {
		socket = io.connect('http://34.73.133.37:8080', { 'forceNew': true });

		// **********************************
		//             SISTEMA
		// **********************************
		// recibe confirmación de conexión
		socket.on(MENSAJES_SOCKET.CONNECT, () => {
			emitirMensaje(MENSAJES_SOCKET.CONECTADO, 'OK')
			Store.dispatch(Acciones.userConectar({}))
		})

		socket.on(MENSAJES_SOCKET.PING, (data) => {
			console.log(new Date() + ': PING')
		});

		// **********************************
		//             USUARIOS
		// **********************************
		// pide conexión
		socket.on(MENSAJES_SOCKET.LOGIN_TOKEN, (data) => {
			let token = Store.getState().usuario.token
			if (token){
				emitirMensaje(MENSAJES_SOCKET.TOKEN, token)
			}
		})
			

		// recibe confirmación de login
		socket.on(MENSAJES_SOCKET.LOGIN, (data) => {
			if (data.success) {
					saveUserCredentials(data)
					registerBegin(data)
			}
		})
		
		// recibe confirmación de token
		socket.on(MENSAJES_SOCKET.TOKEN, (data) => {
			if (data.success) {
				registerBegin(data)
			}
		})

		// recibe confirmación nuevo usuario
		socket.on(MENSAJES_SOCKET.NUEVO_USUARIO, (data) => {
			console.log("Nuevo Usuario: ", data)
			if (data.success) {
				registerBegin(data)
			}
		})

		// **********************************
		//             PARTIDAS
		// **********************************
		// recibe lista de partidas
		socket.on(MENSAJES_SOCKET.PARTIDAS, (data) => {
			console.log("Partidas: ", data) 
			if (data.success) {
				Store.dispatch(Acciones.obtenerPartidas(data.partidas))
			}
		})
		
		// recibe mensaje de partidas nuevas
		socket.on(MENSAJES_SOCKET.PARTIDAS_NUEVAS, (data) => {
			console.log("Partidas Nuevas: ", data) 
			let token = Store.getState().usuario.token
			let name = Store.getState().usuario.name
			emitirMensaje(MENSAJES_SOCKET.PARTIDAS, {token, name})
		})

		// recibe partida creada
		socket.on(MENSAJES_SOCKET.NUEVA_PARTIDA, (data) => {
			console.log("Nueva Partida: ", data)
			if (data.success) {
				partidaNueva(data)
			}
		})

		// recibe jugador añadido
		socket.on(MENSAJES_SOCKET.NUEVO_JUGADOR, (data) => {
			console.log("Nuevo Jugador: ", data)
			if (data.success) {
				partidaNueva(data)
			}
		})
		
		// recibe jugador añadido
		socket.on(MENSAJES_SOCKET.EMPEZAR_PARTIDA, (data) => {
			console.log("Empezar Partida: ", data)
			if (data.success) {
	        Store.dispatch(Acciones.addCampo(data.partida.hoyos))
          browserHistory.push('/Partida/' + data.partida._id)
			}
		})
		
		// **********************************
		//      MENSAJES DE UNA PARTIDA
		// **********************************
		socket.on(MENSAJES_SOCKET.CARGAR_PARTIDA, (data) => {
			console.log("Cargar Partida: ", data)
			if (data.success) {
				let partida = data.partida
			  partida.id = partida._id
		  	Store.dispatch(Acciones.nuevaPartida(partida))
		  	Store.dispatch(Acciones.actualizarJugadores(partida.jugadores))
			  Store.dispatch(Acciones.addCampo(partida.hoyos))
			  let hoyoActual = partida.hoyo_actual ? partida.hoyo_actual : { hoyo: 1, estado: ['G', 'G', 'G', 'G'] }
			  Store.dispatch(Acciones.setEstadoHoyo(hoyoActual))
			}
		})
		
		socket.on(MENSAJES_SOCKET.ACTUALIZAR_JUGADOR, (data) => {
			console.log("Actualizar Jugador: ", data)
			if (data.success) {
				let partida = data.partida
			  partida.id = partida._id
		  	Store.dispatch(Acciones.actualizarJugadores(partida.jugadores))
			  Store.dispatch(Acciones.setEstadoHoyo(partida.hoyo_actual))
			}
		})
		
		/*
		socket.on(MENSAJES_SOCKET.GOLPE_INICIADO, (data) => {
			console.log("Golpe Iniciado: ", data)
			if (data.success) {
				let partida = data.partida
			  partida.id = partida._id
		  	Store.dispatch(Acciones.actualizarJugadores(partida.jugadores))
			  Store.dispatch(Acciones.setEstadoHoyo(partida.hoyo_actual))
			}
		})
		
		socket.on(MENSAJES_SOCKET.ACCION_JUGADOR, (data) => {
			console.log("Accion Jugador: ", data)
			if (data.success) {
				let partida = data.partida
			  partida.id = partida._id
		  	Store.dispatch(Acciones.actualizarJugadores(partida.jugadores))
			  Store.dispatch(Acciones.setEstadoHoyo(partida.hoyo_actual))
			}
		})		
		
		socket.on(MENSAJES_SOCKET.FIN_ACCIONES, (data) => {
			console.log("Accion Jugador: ", data)
			if (data.success) {
				let partida = data.partida
			  partida.id = partida._id
		  	Store.dispatch(Acciones.actualizarJugadores(partida.jugadores))
			  Store.dispatch(Acciones.setEstadoHoyo(partida.hoyo_actual))
			}
		})
		*/
		// **********************************
		//      PRUEBAS
		// **********************************
		socket.on("MENSAJE", (data) => {
			console.log("MENSAJE: ", data)
		})
		
		
	}
	
}

export function emitirMensaje(tipo, datos) {
	socket.emit(tipo, datos)

	return true
}

let registerBegin = (data) => {
	let token = data.token
	let name = data.name
	Store.dispatch(Acciones.userLogin({token, name}))
	emitirMensaje(MENSAJES_SOCKET.PARTIDAS, {token, name})
}

let partidaNueva = (data) => {
	Store.dispatch(Acciones.nuevaPartida(data.partida))
	Store.dispatch(Acciones.nuevoJugador(data.jugador))
}
