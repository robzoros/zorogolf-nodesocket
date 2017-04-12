import Store from './redux/store'
import { setEstadoHoyo, actualizarJugadores } from './redux/acciones-partidas';
import {ESTADO_JUGADOR, ESTADO_PARTIDA, CONST_HEX} from './constantes'
import * as Utiles from './utiles'

let ordenar = (a,b) => {
  return (a._id > b._id) ? 1 : ((b._id > a._id) ? -1 : 0)
}

let resolverGolpe = (jugadores, hoyoActual, eventos, id) => {
  hoyoActual.orden.forEach((iJ) => {
    let bolaC = jugadores[iJ].status.bola.columna
    let bolaF = jugadores[iJ].status.bola.fila
    let hex = Utiles.getHexagono(bolaF, bolaC)

    // Calcular partidaado final de los dados
    let umbralEvento
    switch (hex.style.fill) {
      case 'rgb(255, 0, 0)':
        umbralEvento = jugadores[iJ].status.golpe.cartaPalo.tee
        break
      case 'rgb(0, 255, 0)':
        umbralEvento = jugadores[iJ].status.golpe.cartaPalo.calle
        break
      case 'rgb(0, 128, 0)':
        umbralEvento = jugadores[iJ].status.golpe.cartaPalo.rough
        break
      case 'rgb(255, 255, 0)':
        if (hex.style.fillOpacity === "0.33") umbralEvento = jugadores[iJ].status.golpe.cartaPalo.bunker
        break
      default:
        break
    }
    let acciones = Utiles.incValorDadosDefecto(jugadores[iJ].status.acciones, umbralEvento, jugadores[iJ].status.golpe.cartaPalo.suma_dados)

    //Obtener héxagono destino
    let suma = Utiles.totalDados(acciones)
    let direccion = jugadores[iJ].status.golpe.direccion.split("x").map(c => {return parseFloat(c)})
    let hexDestino = Utiles.destinoBola(hex, bolaC, bolaF, direccion, suma)

    //Obtener destino final
    let cartasEventoDireccion = []
    let desvio = 0
    do {
      let carta = eventos.cartas.pop()
      eventos.descarte.push(carta)
      cartasEventoDireccion.push(carta)
      if (eventos.cartas.length===0) { eventos.cartas = shuffleDeck(eventos.descarte, [])}
      desvio = carta.desvio
    } while (!(jugadores[iJ].status.golpe.cartaPalo.eventos <= cartasEventoDireccion.length || desvio ))
    let numCartas = 0
    if (desvio) numCartas = Utiles.numeroCartasEvento(acciones, umbralEvento)

    let fuerza = 0
    for(let i=0; i<numCartas; i++) {
      let carta = eventos.cartas.pop()
      eventos.descarte.push(carta)
      cartasEventoDireccion.push(carta)
      if (eventos.cartas.length===0) { eventos.cartas = shuffleDeck(eventos.descarte, [])}
      fuerza += carta[jugadores[iJ].status.golpe.cartaPalo.dificultad]
    }

    console.log("Desvío: %i - Fuerza: %i - N.Cartas: %i - CartasJugadas: %o - Descarte: %i - Mazo: %i",
            desvio, fuerza, numCartas, cartasEventoDireccion, eventos.descarte.length, eventos.cartas.length )

    if (fuerza) hexDestino = Utiles.bolaFinal(desvio, fuerza, hexDestino)

    let hoyoEnGreen = false
    let elemento = document.getElementById(hexDestino.fila + "x" + hexDestino.columna)
    if(elemento) {
      let actualizarBola = true
      let svgHex = Utiles.getHexagono(hexDestino.fila, hexDestino.columna)
      switch (svgHex.style.fill) {
        case 'rgb(0, 0, 128)':
          //Agua
          jugadores[iJ].status.golpes_hoyo++
          hexDestino = Utiles.puntoEntrada(hexDestino, bolaF, bolaC)
          break
        case 'rgb(85, 34, 0)':
          //Bosque
          jugadores[iJ].status.golpes_hoyo++
          actualizarBola = false
        case 'rgb(255, 255, 0)':
          if (hex.style.fillOpacity === "1") hoyoEnGreen = true
          break
        default:
          break
      }
      jugadores[iJ].bola = {
        cx: (CONST_HEX.X_INI + hexDestino.columna * (CONST_HEX.RADIO * CONST_HEX.RATIO)) + ((hexDestino.fila % 2) ? 0 : CONST_HEX.RADIO * CONST_HEX.RATIO / 2),
        cy: CONST_HEX.Y_INI + (hexDestino.fila - 1) * CONST_HEX.RADIO * 1.5,
        fila: hexDestino.fila,
        columna:hexDestino.columna,
        color: jugadores[iJ].status.bola.color
      }
    }
    else {
      jugadores[iJ].status.golpes_hoyo++
    }

    // Guardar datos
    console.log("Bola: %o", jugadores[iJ].bola)
    jugadores[iJ].status.partidaado = {
      cartas_evento: cartasEventoDireccion,
      acciones,
      desvio,
      fuerza,
      hex_destino: hexDestino
    }
    if (hoyoEnGreen) {
      jugadores[iJ].status.dados_green = Utiles.getDados(jugadores[iJ].status.golpe.cartaPalo.dados).map(dado => {
        return {valor: dado, color:"Green"}
      })
    }
    else {
      jugadores[iJ].status.golpe = {}
    }
    jugadores[iJ].status.bola = jugadores[iJ].bola
    jugadores[iJ].status.acciones = acciones
    jugadores[iJ].status.iniciativa = 0
    jugadores[iJ].status.estado = hoyoEnGreen ? ESTADO_JUGADOR.ENTRANDO_GREEN : ESTADO_JUGADOR.GOLPE
    hoyoActual.estado[iJ] = hoyoEnGreen ? ESTADO_PARTIDA.ENTRANDO_GREEN : ESTADO_PARTIDA.GOLPE
    Meteor.call('actualizarJugador', jugadores[iJ], id)
  })

  Meteor.call('actualizarEstadoJugador', hoyoActual, jugadores[0], jugadores[0].status, id)
}

let siguienteJugador = (jugadores, hoyoActual, eventos, indice, id ) => {
  let jugador = jugadores[indice]
  hoyoActual.estado[indice] = jugador.status.dados.length ? ESTADO_PARTIDA.TURNO : ESTADO_PARTIDA.FIN_ACCIONES
  jugador.status.estado = jugador.status.dados.length ? ESTADO_JUGADOR.TURNO : ESTADO_JUGADOR.FIN_ACCIONES
  Meteor.call('actualizarEstadoJugador', hoyoActual, jugador, jugador.status, id)
  if (Utiles.contarEstados(hoyoActual.estado, [ESTADO_PARTIDA.FIN_ACCIONES, ESTADO_PARTIDA.GREEN, ESTADO_PARTIDA.FIN_HOYO] ) !== 4){
    let siguiente
    let ind = indice
    do {
      siguiente = Utiles.turno(hoyoActual.orden, ind)
      ind++
    } while(hoyoActual.estado[siguiente] === ESTADO_PARTIDA.FIN_ACCIONES
            || hoyoActual.estado[siguiente] === ESTADO_PARTIDA.GREEN
            || hoyoActual.estado[siguiente] === ESTADO_PARTIDA.FIN_HOYO)

    hoyoActual.estado[siguiente] = ESTADO_PARTIDA.ACCION
    jugadores[siguiente].status.estado = ESTADO_JUGADOR.ACCION
    Meteor.call('actualizarEstadoJugador', hoyoActual, jugadores[siguiente], jugadores[siguiente].status, id)
  }
  else {
    resolverGolpe(jugadores, hoyoActual, eventos, id)
  }
}

let hacerAccion = (jugadores, indice, iAccion) => {
  let jugador = jugadores[indice]
  let accion = jugador.status.acciones[iAccion]
  if (!jugador.status.dados.length)
    return false
  if (accion.accion)
    return true
  return false
}

export function resolverEleccionGolpe(jugadores, hoyoActual, id) {
  console.info("Eleccion Golpe")
  for (let indice = 0; indice < jugadores.length; indice++ ){
    let jugador = jugadores[indice]

    if (jugador.status.estado === ESTADO_JUGADOR.GREEN || jugador.status.estado === ESTADO_JUGADOR.FIN_HOYO )
    {
      let dados = Utiles.getDados(1)
      jugador.status.dados = dados.map(dado => {return {color: jugador.color, valor: dado}})
      jugador.status.iniciativa = -100
      Meteor.call('actualizarJugador', jugador, id)
    }
    else
    {
      let dados = Utiles.getDados(jugador.status.golpe.cartaPalo.dados)
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
            console.log("Cartas(C): %o", jugador.mazo_accion.cartas)
            jugador.mazo_accion.cartas.sort((a,b) => ordenar(a,b) )
            console.log("Cartas(C): %o", jugador.mazo_accion.cartas)
          }
          jugador.mazo_accion.descarte.push(jugador.status.golpe.cartaAccion)
          jugador.mazo_accion.descarte.sort((a,b) => ordenar(a,b) )
          jugador.mazo_accion.cartas.splice(jugador.mazo_accion.cartas.findIndex(x => x._id === jugador.status.golpe.cartaAccion._id), 1)
          jugador.status.estado =  ESTADO_JUGADOR.TURNO
        }
        else {
            jugador.status.estado = ESTADO_JUGADOR.ACCION_PREVIA
        }
      }
      else if (jugador.status.accion_mazo === 'Mazo') {
        jugador.mazo_accion.cartas.concat(jugador.mazo_accion.descarte)
        console.log("Cartas(M): %o", jugador.mazo_accion.cartas)
        jugador.mazo_accion.cartas.sort((a,b) => ordenar(a,b) )
        console.log("Cartas(M): %o", jugador.mazo_accion.cartas)
        jugador.mazo_accion.descarte = []
        jugador.status.estado =  ESTADO_JUGADOR.TURNO
      }
      else {
        jugador.mazo_accion.descarte.push(jugador.status.golpe.cartaAccion)
        jugador.mazo_accion.descarte.sort((a,b) => ordenar(a,b) )
        jugador.mazo_accion.cartas.splice(jugador.mazo_accion.cartas.findIndex(x => x._id === jugador.status.golpe.cartaAccion._id), 1)
        jugador.status.estado =  ESTADO_JUGADOR.TURNO
      }

      if (jugador.status.golpe.cartaPalo.modificar) jugador.status.estado = ESTADO_JUGADOR.ACCION_PREVIA

      let estado = jugador.status.estado === ESTADO_JUGADOR.ACCION_PREVIA ? ESTADO_PARTIDA.ACCION_PREVIA : ESTADO_PARTIDA.TURNO
      hoyoActual.estado[indice] = estado
      Meteor.call('actualizarJugador', jugador, id)
      Meteor.call('actualizarEstadoJugador', hoyoActual, jugador, jugador.status, id)
    }
  } // END for

  if (Utiles.contarEstados(hoyoActual.estado, [ESTADO_PARTIDA.TURNO, ESTADO_PARTIDA.GREEN, ESTADO_PARTIDA.FIN_HOYO] ) === 4) {
    let ordenAnterior = hoyoActual.orden ? hoyoActual.orden : [0, 1, 2, 3]
    let orden = jugadores.map((j, indice) => {return {orden: j.status.iniciativa*100, jugador: indice}})
    orden.sort((a,b) => {return (a.orden < b.orden) ? 1 : ((b.orden < a.orden) ? -1 : 0)})
    hoyoActual.orden = orden.map(j => {return j.jugador})
    hoyoActual.estado[hoyoActual.orden[0]] = ESTADO_PARTIDA.ACCION
    let jugador = jugadores[hoyoActual.orden[0]]
    jugador.status.estado = ESTADO_JUGADOR.ACCION
    Meteor.call('actualizarEstadoJugador', hoyoActual, jugador, jugador.status, id)
  }
  Store.dispatch(actualizarJugadores(jugadores))
  Store.dispatch(setEstadoHoyo(hoyoActual))
}

export function resolverAccion(jugadores, hoyoActual, eventos, indice, iAccion, iDado, id) {
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
  else {
    siguienteJugador(jugadores, hoyoActual, eventos, indice, id)
  }
}

export function comprarDado(jugadores, iJugador, iOponente, iDado, iDadoOponente, hoyoActual, eventos, id){
  let jugador = jugadores[iJugador]
  let oponente = jugadores[iOponente]
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
  hoyoActual.accion_dado = -1

  Meteor.call('actualizarJugador', jugador, id)
  Meteor.call('actualizarJugador', oponente, id)
  siguienteJugador(jugadores, hoyoActual, eventos, iJugador, id)
}

export function voltearDados(jugadores, iJugador, dados, hoyoActual, eventos, id){
  let jugador = jugadores[iJugador]
  let coste = dados.length === 1 ? 5 : (dados.length === 2 ? 9 :  12)
  jugador.progreso -= coste
  for (let i=0; i<dados.length; i++) jugador.status.dados[dados[i]].valor = 7 - jugador.status.dados[dados[i]].valor
  jugador.status.dados.sort((a,b) => {return (a.valor > b.valor) ? 1 : ((b.valor < a.valor) ? -1 : 0)})
  hoyoActual.accion_dado = -1
  Meteor.call('actualizarJugador', jugador, id)
  siguienteJugador(jugadores, hoyoActual, eventos, iJugador, id)
}

export function rerolDado(jugadores, iJugador, dados, hoyoActual, eventos, id){
  let jugador = jugadores[iJugador]
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
  hoyoActual.accion_dado = -1
  Meteor.call('actualizarJugador', jugador, id)
  siguienteJugador(jugadores, hoyoActual, eventos, iJugador, id)
}

export function sumar1Dado(jugadores, iJugador, iDado, hoyoActual, eventos, id){
  let jugador = jugadores[iJugador]
  jugador.progreso -= 1
  jugador.status.dados[iDado].valor += 1
  jugador.status.dados.sort((a,b) => {return (a.valor > b.valor) ? 1 : ((b.valor < a.valor) ? -1 : 0)})
  hoyoActual.accion_dado = -1
  Meteor.call('actualizarJugador', jugador, id)
  siguienteJugador(jugadores, hoyoActual, eventos, iJugador, id)
}

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
