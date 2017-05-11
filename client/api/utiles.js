export function getJugador(jugadores, nombre) {
  return jugadores.find( jugador => jugador.nombre === nombre)
}

export function getItem(coleccion, clave, valor) {
  return coleccion.find( item => item[clave] === valor)
}

export function getIndiceJugador(jugadores, nombre) {
  return jugadores.map((j) => j.nombre).indexOf(nombre)
}

export function estiloJugador (color) {
  let estilo = {backgroundColor: color}
  switch (color) {
    case "Black":
      estilo.color = 'ivory'
      break
    case "Red":
      estilo.color = 'ivory'
      break
    case "White":
      estilo.color = 'black'
      break
    case "Blue":
      estilo.color = 'ivory'
      break
    case "Yellow":
      estilo.color = 'black'
      break
    default:
      estilo.color = 'black'
      break
  }

  return estilo
}

export function shuffleDeck(mazo, mazoAux) {
  if (mazo.length) {
    let carta = Math.floor((Math.random() * mazo.length))
    mazoAux.push(mazo[carta])
    mazo.splice(carta,1)
    return shuffleDeck(mazo, mazoAux)
  }
  else {
    return mazoAux
  }
}

export function hexDestino(el) {
  var bbox = el.getBBox();
  var cx = parseFloat( (bbox.x + bbox.width/2).toFixed(4))
  var cy = parseFloat((bbox.y + bbox.height/2).toFixed(4))
  return {elegido: true, cx, cy}
}

export function getHexagono(fila, columna) {
  let idHex= fila + "x" + columna
  return document.getElementById(idHex)
}

export function turno(orden, jugador){
  let indice = orden.indexOf(jugador)
  return (indice === 3) ? orden[0] : orden[indice+1]
}


export function hexBandera(green) {
  let hex = green.bandera.hexagono
  let iH = green.hexagonos.indexOf(hex)
  let loseta = green.losetas[iH]
  let l = loseta.split('x')
  let b = green.bandera.lugar.split('x')

  let col = parseInt(b[0]) + ((l[1]-1)*8) + (l[0] % 2 ? 0 : 4)
  let fila = parseInt(b[1]) + ((l[0]-1)*5)
  return {col, fila}
}
