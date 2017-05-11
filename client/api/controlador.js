import Store from './redux/store'
import { setEstadoHoyo, actualizarJugadores } from './redux/acciones-partidas';
import { CONST_HEX } from './constantes'
import CONSTANTES from '../../shared/server_const'
import * as Utiles from './utiles'

// *****************************************************
// Pasa el turno al siguiente jugador
export function siguienteJugador (hoyoActual, indice ) {
	let siguiente
	let ind = indice
	do {
	  siguiente = Utiles.turno(hoyoActual.orden, ind)
	  console.log("Siguiente: ", siguiente)
	  ind = siguiente
	} while( (hoyoActual.estado[siguiente] === CONSTANTES.ESTADO_PARTIDA.FIN_ACCIONES
			|| hoyoActual.estado[siguiente] === CONSTANTES.ESTADO_PARTIDA.GREEN
			|| hoyoActual.estado[siguiente] === CONSTANTES.ESTADO_PARTIDA.FIN_HOYO) && siguiente !== indice)
	
	return siguiente
}
// *****************************************************

let hacerAccion = (jugadores, indice, iAccion) => {
  let jugador = jugadores[indice]
  let accion = jugador.status.acciones[iAccion]
  if (!jugador.status.dados.length)
		return false
  if (accion.accion)
		return true
  return false
}


export function elegirAccion(jugadores, hoyoActual, indice, iAccion, iDado) {
  
  let jugador = jugadores[indice]
  let accion = jugador.status.acciones[iAccion]
  let dado =  jugador.status.dados[iDado]

  accion.dado = dado
  accion.utilizado = true
  jugador.status.dados.splice(iDado, 1)

  if (hacerAccion(jugadores, indice, iAccion)) {
		let accionDado
		switch (parseInt(iAccion)) {
		  case 4:
			accionDado = 0
			break
		  case 5:
			accionDado = 2
			break
		  default:
			accionDado = iAccion
			break
		}
		hoyoActual.accion_dado = parseInt(accionDado)
		Store.dispatch(setEstadoHoyo(hoyoActual))
		Store.dispatch(actualizarJugadores(jugadores))
  }
  else
  	hoyoActual.accion_dado = -1
}

// ****************************************************************************
// FUNCIONES LLAMADAS DESDE RESOLVER ACCION DADO DE UNA PARTIDA
// Acciones disparadas por la elección de una acción y un dado
// ****************************************************************************

// La compra de un dado se realiza cambiando un dado propio por uno de un rival
// Tiene un coste en 'progreso' que se paga al dueño del dado.
export function comprarDado(jugador, oponente, iDado, iDadoOponente){
  let dado = jugador.status.dados[iDado]
  let dadoOponente = oponente.status.dados[iDadoOponente]

  jugador.status.dados.splice(iDado, 1)
  oponente.status.dados.splice(iDadoOponente, 1)
  jugador.status.dados.push(dadoOponente)
  oponente.status.dados.push(dado)
  jugador.progreso -= dadoOponente.valor
  oponente.progreso += dadoOponente.valor
  jugador.status.dados.sort((a,b) => {return (a.valor > b.valor) ? 1 : ((b.valor < a.valor) ? -1 : 0)})
  oponente.status.dados.sort((a,b) => {return (a.valor > b.valor) ? 1 : ((b.valor < a.valor) ? -1 : 0)})
}

// Se le da la vuelta a n dados seleccionados por el jugador
export function voltearDados(jugador, dados){
  let coste = dados.length === 1 ? 5 : (dados.length === 2 ? 9 :  12)
  jugador.progreso -= coste
  for (let i=0; i<dados.length; i++) jugador.status.dados[dados[i]].valor = 7 - jugador.status.dados[dados[i]].valor
  jugador.status.dados.sort((a,b) => {return (a.valor > b.valor) ? 1 : ((b.valor < a.valor) ? -1 : 0)})
}

// Reroll de n dados seleccionados por el jugador
export function rerolDado(jugador, dados){
  let coste
  switch (dados.length) {
	case 1:
	  coste = 1
	  break
	case 2:
	  coste = 3
	  break
	case 3:
	  coste = 5
	  break
	case 4:
	  coste = 8
	  break
	default:
	  coste = 10
	  break
  }
  jugador.progreso -= coste
  for (let i=0; i<dados.length; i++) jugador.status.dados[dados[i]].valor = Math.floor(Math.random() *  6) + 1
  jugador.status.dados.sort((a,b) => {return (a.valor > b.valor) ? 1 : ((b.valor < a.valor) ? -1 : 0)})
}

// Se suma 1 a un dado seleccionado por el jugador
export function sumar1Dado(jugador, iDado, eventos){
  jugador.progreso -= 1
  jugador.status.dados[iDado].valor += 1
  jugador.status.dados.sort((a,b) => {return (a.valor > b.valor) ? 1 : ((b.valor < a.valor) ? -1 : 0)})
}
// ****************************************************************************
// Fin Acciones asociadas a dados
// ****************************************************************************


export function resolverBoteGreen(jugador, bote, iJ, hoyoActual, hoyo, id) {
  let idLoseta = jugador.status.bola.fila + "x" + jugador.status.bola.columna
  let h = hoyo.green.hexagonos.indexOf(idLoseta)
  let loseta = hoyo.green.losetas[h]
  let l = loseta.split('x')
  let col = 3 + ((l[1]-1)*8) + (l[0] % 2 ? 0 : 4)
  let fila = 4 + ((l[0]-1)*5)

  switch (bote.direccion) {
	case 1:
	  fila -= bote.fuerza
	  break
	case 2:
	  col += bote.fuerza
	  fila -= Math.ceil(bote.fuerza/2)
	  break
	case 3:
	  col += bote.fuerza
	  fila += Math.floor(bote.fuerza/2)
	  break
	case 4:
	  fila += bote.fuerza
	  break
	case 5:
	  col -= bote.fuerza
	  fila += Math.floor(bote.fuerza/2)
	  break
	case 6:
	  col -= bote.fuerza
	  fila -= Math.ceil(bote.fuerza/2)
	  break
	default:
	  break
  }

  let bola = jugador.status.bola
  let bandera = Utiles.hexBandera(hoyo.green)
  bola.green_columna = col
  bola.green_fila = fila
  jugador.bola = bola
  jugador.status.bola = bola

  console.log("Bandera: %o, Col %i, Fila %i", bandera, col, fila)

  if (bandera.col === col && bandera.fila === fila) {
	hoyoActual.estado[iJ] = ESTADO_PARTIDA.FIN_HOYO
	jugador.status.estado = ESTADO_JUGADOR.FIN_HOYO
  }
  else {
	hoyoActual.estado[iJ] = ESTADO_PARTIDA.GOLPE
	jugador.status.estado = ESTADO_JUGADOR.GOLPE
  }

  Meteor.call('actualizarJugador', jugador, id)

  Meteor.call('actualizarEstadoJugador', hoyoActual, jugador, jugador.status, id)
}
