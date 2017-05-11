var Constantes = require('../../shared/server_const')
var zorogolf_db = require('./zorogolf_db')
var utiles = require('../../shared/utiles')
var Hexagonos = require('./hex')

// Se define la función que se llamará desde Socket
exports.processMessage = (socket, message, io) => {
    switch (message) {
		case Constantes.LOGIN:
		case Constantes.TOKEN:
		case Constantes.NUEVO_USUARIO:
		case Constantes.PARTIDAS:
		case Constantes.NUEVA_PARTIDA:
		case Constantes.CARGAR_PARTIDA:
		    processSimpleMessage(socket, message, io)
		    break
		case Constantes.ACTUALIZAR_JUGADOR:
		case Constantes.ACCION_JUGADOR:
		case Constantes.ACCION_PREVIA:
		    processRoomMessage(socket, message, io)
		    break
		case Constantes.NUEVO_JUGADOR:
		    processNewPlayer(socket, message, io)
		    break
        default:
		    processSimpleMessage(socket, message, io)
    }
}

// Función de BBDD a llamar sefún mensaje.
var getRequest = (message) => {
    switch (message) {
		case Constantes.LOGIN:
		    return zorogolf_db.login
		case Constantes.TOKEN:
		    return zorogolf_db.verificarToken
		case Constantes.NUEVO_USUARIO:
		    return zorogolf_db.crearUsuario
		case Constantes.PARTIDAS:
		    return zorogolf_db.getListaPartidas
		case Constantes.NUEVA_PARTIDA:
		    return zorogolf_db.addPartida
		case Constantes.CARGAR_PARTIDA:
		    return zorogolf_db.getPartida
		case Constantes.ACTUALIZAR_JUGADOR:
		case Constantes.ACCION_PREVIA:
		    return zorogolf_db.setJugadorEstado
		case Constantes.ACCION_JUGADOR:
		    return zorogolf_db.setJugadoresEstado
		case Constantes.NUEVO_JUGADOR:
		    return processNewPlayer
        default:
            // code
            return null
    }

}

// Procesamos un mensaje del que solo queremos que devuelva el valor obtenido al llamar a la
// función pasada por parámetro.
// En el caso de Nueva Partida además hacemos broadcast a todos los sockets con las nuevas
// partidas
var processSimpleMessage = (socket, message, io) => {
	var broadcast = message === Constantes.NUEVA_PARTIDA ? true : false
	var newRoom = (message === Constantes.NUEVA_PARTIDA || message === Constantes.CARGAR_PARTIDA ) ? true : false
	var broadcastMessage = message === Constantes.NUEVA_PARTIDA ? Constantes.PARTIDAS_NUEVAS : ""

	socket.on(message, (dataMsg) => {
		console.log(message + ": " + socket.id)
		simpleRequest(socket, io, getRequest(message), message, dataMsg, broadcast, broadcastMessage, newRoom)
	})
}

// Mensajes que procesan un mensaje con una sola llamada a función
var simpleRequest = (socket, io, request, message, dataMsg, broadcast, broadcastMessage, newRoom) => {
	request(dataMsg)
    	.then((data) => {
    		if (broadcast)
    			io.emit(broadcastMessage, data)
    		if (newRoom){
    			exports.leaveRooms(socket)
    			console.log("Socket ", socket.id, " se une a sala ", data.partida._id)
    			socket.join(data.partida._id)
    		}
    		socket.emit(message, data)
    	})
    	.catch((data)=> {
    		console.log(message)
    		socket.emit(message, data)
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
	    			console.log("Socket ", socket.id, " se une a sala ", data.partida._id)
        			socket.join(data.partida._id)
        		}
        		io.in(data.partida._id).emit(Constantes.NUEVO_JUGADOR, data)
        		io.emit(Constantes.PARTIDAS_NUEVAS, data)
        		if (data.partida.jugadores.length === 4) {
        		    zorogolf_db.initPartida(data.partida._id, "Zorocampo")
        		        .then( (dataPartida) => {
        		            io.in(dataPartida.partida._id).emit(Constantes.EMPEZAR_PARTIDA, dataPartida)
        		        })
        		        .catch( (err) => {
                    		console.log("Iniciar partida: ", err)
        		        })
        		}
        	})
        	.catch((data)=> {
        		console.log(Constantes.NUEVO_JUGADOR + " error: ", data)
        		socket.emit(Constantes.NUEVO_JUGADOR, data)
        	})
	})
}


// Mensajes dentro de una sala (partida)
var processRoomMessage = (socket, message, io) => {
	socket.on(message, (msg) => {
	    console.log(message + ": ", socket.id)
		getRequest(message)(msg)
			.then((data) => {
				if(!socket.rooms[data.partida._id]) {
					exports.leaveRooms(socket)
	    			console.log("Socket ", socket.id, " se une a sala ", data.partida._id)
					socket.join(data.partida._id)
				}
				console.log("Actualizado Jugador: ", data.partida._id, io.sockets.adapter.rooms[data.partida._id])
				io.in(data.partida._id).emit(Constantes.ACTUALIZAR_JUGADOR, data)
				controladorPartida(socket, data.partida, io)
			})
			.catch((data)=> {
				console.log(message + " error: ", data)
				socket.emit(message, data)
			})
	})
}

// Controlador de partida.
// Dependiendo del estado de los jugadores (esperando, terminado, jugando, etc...)
// modificará el control de los jugadores
var controladorPartida = (socket, partida, io) => {
	var funcion
	if (utiles.contarEstados(partida.hoyo_actual.estado, [Constantes.ESTADO_PARTIDA.TURNO]) === 4 ) {
		funcion = terminarAccionPrevia
	}
	else if ( utiles.contarEstados(partida.hoyo_actual.estado, [Constantes.ESTADO_PARTIDA.ESPERANDO, Constantes.ESTADO_PARTIDA.FIN_HOYO, Constantes.ESTADO_PARTIDA.GREEN]) === 4 ){
        funcion = resolverEleccionGolpe
	}
	else if ( utiles.contarEstados(partida.hoyo_actual.estado, [Constantes.ESTADO_PARTIDA.FIN_ACCIONES]) === 4 ) {
	    funcion = resolverGolpe
	}
	
	//Ejecutamos la función que corresponde
	if (funcion){
		funcion(partida)
			.then((data) => {
				var sendMessage = { success: true, partida: data}
				io.in(data._id).emit(Constantes.ACTUALIZAR_JUGADOR, sendMessage)
			})
			.catch((err) => { 
				console.log("Elección golpe error: ", err)
			})
	}

}

var ordenar = (a,b) => {
  return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)
}

// Actualizamos datos una vez todos los jugadores han elegido golpe.
var resolverEleccionGolpe = (partida) => {

  for (var indice = 0; indice < partida.jugadores.length; indice++ ){
	var jugador = partida.jugadores[indice]
	var dados

	if (jugador.status.estado === Constantes.ESTADO_JUGADOR.GREEN || jugador.status.estado === Constantes.ESTADO_JUGADOR.FIN_HOYO )
	{
	  dados = utiles.getDados(1)
	  jugador.status.dados = dados.map(dado => {return {color: jugador.color, valor: dado}})
	  jugador.status.iniciativa = -100
  
	  //Meteor.call('actualizarJugador', jugador, id)
	}
	else
	{
	  dados = utiles.getDados(jugador.status.golpe.cartaPalo.dados)
	  jugador.progreso += jugador.status.golpe.cartaAccion.progreso
	  jugador.status.dados = dados.map(dado => {return {color: jugador.color, valor: dado}})
	  jugador.status.acciones = jugador.status.golpe.cartaAccion.acciones.map((accion) => {return {accion, dado:null, utilizado: false }})
	  jugador.status.accion_mazo = jugador.status.golpe.cartaAccion.accion_mazo
	  jugador.status.iniciativa = jugador.status.golpe.cartaAccion._id
	  jugador.status.golpes_hoyo = jugador.status.golpes_hoyo ? jugador.status.golpes_hoyo + 1 : 1
	  if (jugador.status.accion_mazo === 'Carta') {
		if (jugador.mazo_accion.descarte.length <= 1) {
		  if (jugador.mazo_accion.descarte.length === 1) {
			jugador.mazo_accion.cartas.push(jugador.mazo_accion.descarte[0])
			jugador.mazo_accion.descarte.pop()
			jugador.mazo_accion.cartas.sort((a,b) => ordenar(a,b) )
			console.log("Cartas(C): ", jugador.mazo_accion.cartas)
		  }
		  jugador.mazo_accion.descarte.push(jugador.status.golpe.cartaAccion)
		  jugador.mazo_accion.descarte.sort((a,b) => ordenar(a,b) )
		  jugador.mazo_accion.cartas.splice(jugador.mazo_accion.cartas.findIndex(x => x._id === jugador.status.golpe.cartaAccion._id), 1)
		  jugador.status.estado =  Constantes.ESTADO_JUGADOR.TURNO
		}
		else {
			jugador.status.estado = Constantes.ESTADO_JUGADOR.ACCION_PREVIA
		}
	  }
	  else if (jugador.status.accion_mazo === 'Mazo') {
		jugador.mazo_accion.cartas.concat(jugador.mazo_accion.descarte)
		console.log("Cartas(M): ", jugador.mazo_accion.cartas)
		jugador.mazo_accion.cartas.sort((a,b) => ordenar(a,b) )
		console.log("Cartas(M): ", jugador.mazo_accion.cartas)
		jugador.mazo_accion.descarte = []
		jugador.status.estado =  Constantes.ESTADO_JUGADOR.TURNO
	  }
	  else {
		jugador.mazo_accion.descarte.push(jugador.status.golpe.cartaAccion)
		jugador.mazo_accion.descarte.sort((a,b) => ordenar(a,b) )
		jugador.mazo_accion.cartas.splice(jugador.mazo_accion.cartas.findIndex(x => x._id === jugador.status.golpe.cartaAccion._id), 1)
		jugador.status.estado =  Constantes.ESTADO_JUGADOR.TURNO
	  }

	  if (jugador.status.golpe.cartaPalo.modificar) jugador.status.estado = Constantes.ESTADO_JUGADOR.ACCION_PREVIA

	  var estado = jugador.status.estado === Constantes.ESTADO_JUGADOR.ACCION_PREVIA ? Constantes.ESTADO_PARTIDA.ACCION_PREVIA : Constantes.ESTADO_PARTIDA.TURNO
	  partida.hoyo_actual.estado[indice] = estado

	  //Meteor.call('actualizarJugador', jugador, id)
	  //Meteor.call('actualizarEstadoJugador', hoyoActual, jugador, jugador.status, id)
	}
  } // END for

  if (utiles.contarEstados(partida.hoyo_actual.estado, [Constantes.ESTADO_PARTIDA.TURNO, Constantes.ESTADO_PARTIDA.GREEN, Constantes.ESTADO_PARTIDA.FIN_HOYO] ) === 4) {
	var orden = partida.jugadores.map((j, indice) => {return {orden: j.status.iniciativa*100, jugador: indice}})
	orden.sort((a,b) => {return (a.orden < b.orden) ? 1 : ((b.orden < a.orden) ? -1 : 0)})
	partida.hoyo_actual.orden = orden.map(j => {return j.jugador})
	partida.hoyo_actual.estado[partida.hoyo_actual.orden[0]] = Constantes.ESTADO_PARTIDA.ACCION
	var jugador = partida.jugadores[partida.hoyo_actual.orden[0]]
	jugador.status.estado = Constantes.ESTADO_JUGADOR.ACCION

  }
  
  return zorogolf_db.actualizaPartida(partida)
}


var resolverGolpe = (partida)  => {
	// Para cada jugador resolvemos el golpe.
	partida.hoyo_actual.orden.forEach((iJ) => {
		var recorrido = utiles.getRecorrido(partida.hoyos[partida.hoyo_actual.hoyo-1].recorrido)

		var bolaC = partida.jugadores[iJ].status.bola.columna
		var bolaF = partida.jugadores[iJ].status.bola.fila
		var hex = recorrido[bolaF-1][bolaC]
		
		// Umbral dependiendo desde donde se da el golpe
		var umbralEvento
		switch (hex) {
			case 't':
				umbralEvento = partida.jugadores[iJ].status.golpe.cartaPalo.tee
				break
			case 'y':
				umbralEvento = partida.jugadores[iJ].status.golpe.cartaPalo.calle
				break
			case 'r':
				umbralEvento = partida.jugadores[iJ].status.golpe.cartaPalo.rough
				break
			case 's':
				umbralEvento = partida.jugadores[iJ].status.golpe.cartaPalo.bunker
				break
			default:
				break
		}
		console.log("Bola, terreno, umbral, Carta Jugada:", bolaC, bolaF, hex, umbralEvento, partida.jugadores[iJ].status.golpe.cartaPalo )

		//Obtener héxagono destino
		var dados = utiles.incValorDadosDefecto(partida.jugadores[iJ].status.acciones, umbralEvento, partida.jugadores[iJ].status.golpe.cartaPalo.suma_dados)
		console.log("Dados: ", dados)

		var suma = utiles.totalDados(dados)
		if (partida.jugadores[iJ].status.golpe.chip) suma = Math.ceil(suma / 2)
		var direccion = partida.jugadores[iJ].status.golpe.direccion.split("x").map(c => {return parseFloat(c)})

		var rutaDestino = Hexagonos.rutaBola(bolaC, bolaF, direccion, suma)
		var hexDestino = rutaDestino[suma]
		console.log("Suma Dados: %d, HexDestino:", suma, hexDestino)	


		//Obtener destino final
		var eventos = partida.eventos
		var cartasEventoDireccion = []
		var desvio = 0
		do {
			var carta = eventos.cartas.pop()
			if (eventos.cartas.length===0) eventos.cartas = utiles.shuffleDeck(eventos.descarte, [])
			cartasEventoDireccion.push(carta)
			eventos.descarte.push(carta)
			desvio = carta.desvio
		} while (!(partida.jugadores[iJ].status.golpe.cartaPalo.eventos <= cartasEventoDireccion.length || desvio ))
		var numCartas = 0
		if (desvio) numCartas = utiles.numeroCartasEvento(dados, umbralEvento)
		
		var fuerza = 0
		for(var i=0; i<numCartas; i++) {
			var carta = eventos.cartas.pop()
			if (eventos.cartas.length===0) { eventos.cartas = utiles.shuffleDeck(eventos.descarte, [])}
			eventos.descarte.push(carta)
			cartasEventoDireccion.push(carta)
			fuerza += carta[partida.jugadores[iJ].status.golpe.cartaPalo.dificultad]
		}

		console.log("CartasJugadas: ", cartasEventoDireccion)
		console.log("Desvío: %d - Fuerza: %d - N.Cartas: %d - Descarte: %d - Mazo: %d",
				desvio, fuerza, numCartas, eventos.descarte.length, eventos.cartas.length )
		
		if (fuerza) hexDestino = Hexagonos.bolaFinal(desvio, fuerza, hexDestino)
		
		var hoyoEnGreen = false
		var elemento
		if (recorrido[hexDestino.row-1]) elemento = recorrido[hexDestino.row-1][hexDestino.col]
		if (elemento) {
			var actualizarBola = true
			switch (elemento) {
				case 'w':
					//Agua
					partida.jugadores[iJ].status.golpes_hoyo++
					hexDestino = Hexagonos.puntoEntrada(recorrido, rutaDestino, suma)
					break
				case 'f':
					//Bosque
					partida.jugadores[iJ].status.golpes_hoyo++
					actualizarBola = false
				case 'g':
				case 'l':
					hoyoEnGreen = true
					break
				default:
					break
			}
			if (actualizarBola) {
				partida.jugadores[iJ].bola = {
					//cx: (CONST_HEX.X_INI + hexDestino.columna * (CONST_HEX.RADIO * CONST_HEX.RATIO)) + ((hexDestino.fila % 2) ? 0 : CONST_HEX.RADIO * CONST_HEX.RATIO / 2),
					//cy: CONST_HEX.Y_INI + (hexDestino.fila - 1) * CONST_HEX.RADIO * 1.5,
					fila: hexDestino.row,
					columna: hexDestino.col,
					color: partida.jugadores[iJ].status.bola.color
				}
			}
		}
		else {
			partida.jugadores[iJ].status.golpes_hoyo++
		}
		
		// Guardar datos
		console.log("Bola y elemento: ", partida.jugadores[iJ].bola, elemento)
		partida.jugadores[iJ].status.resultado = {
			cartas_evento: cartasEventoDireccion,
			acciones: dados,
			desvio,
			fuerza,
			hex_destino: hexDestino
		}
		if (hoyoEnGreen) {
			partida.jugadores[iJ].status.dados_green = utiles.getDados(partida.jugadores[iJ].status.golpe.cartaPalo.dados).map(dado => {
				return {valor: dado, color:"Green"}
			})
		}
		else {
			partida.jugadores[iJ].status.golpe = {}
		}
		partida.jugadores[iJ].status.bola = partida.jugadores[iJ].bola
		partida.jugadores[iJ].status.acciones = []
		partida.jugadores[iJ].status.iniciativa = 0
		partida.jugadores[iJ].status.estado = hoyoEnGreen ? Constantes.ESTADO_JUGADOR.ENTRANDO_GREEN : Constantes.ESTADO_JUGADOR.GOLPE
		partida.hoyo_actual.estado[iJ] = hoyoEnGreen ? Constantes.ESTADO_PARTIDA.ENTRANDO_GREEN : Constantes.ESTADO_PARTIDA.GOLPE
	})

	return zorogolf_db.actualizaPartida(partida)
	//Meteor.call('actualizarEstadoJugador', hoyoActual, partida.jugadores[0], partida.jugadores[0].status, id)
}

var terminarAccionPrevia = (partida) => {
	//Obtenemos orden de partida, lo actualizamos y ponemos estado para jugador en turnp
	var orden = partida.jugadores.map((j, indice) => {return {orden: j.status.iniciativa*100, jugador: indice}})
	orden.sort((a,b) => {return (a.orden < b.orden) ? 1 : ((b.orden < a.orden) ? -1 : 0)})
	partida.hoyo_actual.orden = orden.map(j => {return j.jugador})
	partida.hoyo_actual.estado[partida.hoyo_actual.orden[0]] = Constantes.ESTADO_PARTIDA.ACCION
	var jugador = partida.jugadores[partida.hoyo_actual.orden[0]]
	jugador.status.estado = Constantes.ESTADO_JUGADOR.ACCION
	
	return zorogolf_db.actualizaPartida(partida)
}

// Deja todas las salas menos la propia
exports.leaveRooms = (socket) => {
	/*Object.keys(socket.rooms).forEach( (key) => {
		console.log("Room " + key + ": ", socket.id)
		if (key !== socket.id) socket.leave(key)
	});*/
}

// Inicializamos controller
exports.init = () => {
	// Se recogen los mazos para tenerlos en memoria
    zorogolf_db.getMazos()
    zorogolf_db.getCampos()
}

exports.salvar = (id) => {
    zorogolf_db.salvarDocumento(id)
}

exports.ejecutar = (data) => {
	zorogolf_db.getPartida(data.id)
		.then( (datos) => { 
			resolverGolpe(datos.partida) 
		})
    	.catch((err) => { 
			console.log("Error: ", err)
    	})		
}
