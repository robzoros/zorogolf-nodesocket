import Store from './redux/store'
import * as Acciones from './redux/acciones-partidas'
import { saveUserCredentials } from './sesion'
import MENSAJES_SOCKET from '../../shared/socket_const'

let socket

export function conectar() {
	//socket = io.connect('http://localhost:8080', { 'forceNew': true })
	//socket = io.connect('https://127.0.0.1:3100', { 'forceNew': true });
	if (!socket) {
		socket = io.connect('https://zorogolf.zoroastro.c9users.io', { 'forceNew': true });

		// **********************************
		//             SISTEMA
		// **********************************
		// recibe confirmación de conexión
		socket.on(MENSAJES_SOCKET.CONNECT, function () {
			emitirMensaje(MENSAJES_SOCKET.CONECTADO, 'OK')
			Store.dispatch(Acciones.userConectar({}))
		})

		socket.on(MENSAJES_SOCKET.PING, function(data){
			console.log(new Date() + ': PING')
		});

		// **********************************
		//             USUARIOS
		// **********************************
		// pide conexión
		socket.on(MENSAJES_SOCKET.LOGIN_TOKEN, function (data) {
			console.log("login-token: ", data)
			let token = Store.getState().usuario.token
			if (token){
				emitirMensaje(MENSAJES_SOCKET.TOKEN, token)
			}
		})
			

		// recibe confirmación de login
		socket.on(MENSAJES_SOCKET.LOGIN, function (data) {
			console.log("login: ", data)
			if (data.success) {
					saveUserCredentials(data)
					registerBegin(data)
			}
		})
		
		// recibe confirmación de token
		socket.on(MENSAJES_SOCKET.TOKEN, function (data) {
			console.log("Token: ", data)
			if (data.success) {
				registerBegin(data)
			}
		})

		// recibe confirmación nuevo usuario
		socket.on(MENSAJES_SOCKET.NUEVO_USUARIO, function (data) {
			console.log("Nuevo Usuario: ", data)
			if (data.success) {
				registerBegin(data)
			}
		})

		// **********************************
		//             PARTIDAS
		// **********************************
		// recibe lista de partidas
		socket.on(MENSAJES_SOCKET.PARTIDAS, function (data) {
			console.log("Partidas: ", data) 
			if (data.success) {
				Store.dispatch(Acciones.obtenerPartidas(data.partidas))
			}
		})
		
		// recibe partida creada
		socket.on(MENSAJES_SOCKET.NUEVA_PARTIDA, function (data) {
			console.log("Nueva Partida: ", data)
			if (data.success) {
				partidaNueva(data)
			}
		})

		// recibe jugador añadido
		socket.on(MENSAJES_SOCKET.NUEVO_JUGADOR, function (data) {
			console.log("Nuevo Jugador: ", data)
			if (data.success) {
				partidaNueva(data)
			}
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
	let token = Store.getState().usuario.token
	let name = Store.getState().usuario.name
	emitirMensaje(MENSAJES_SOCKET.PARTIDAS, {token, name})
}