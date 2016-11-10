export function getJugador(jugadores, nombre) {
  return jugadores.find( jugador => jugador.nombre === nombre)
}

export function getItem(coleccion, clave, valor) {
  return coleccion.find( item => item[clave] === valor)
}

export function getIndiceJugador(jugadores, nombre) {
  return jugadores.findIndex(x => x.nombre === nombre)
}

export function estiloJugador (color) {
  let estilo = {backgroundColor: color}
  switch (color) {
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

export function getDados(numero) {
  let dados = []
  for (let i=0; i< numero; i++){
    dados.push((Math.floor(Math.random() *  6) + 1))
  }
  return dados.sort((a, b) => {return a-b})
}

export function contarEstados(estado, lista) {
  return estado.reduce((x,y) => { return x + (lista.indexOf(y) < 0 ? 0 : 1) }, 0)
}

export function turno(orden, jugador){
  let indice = orden.indexOf(jugador)
  return (indice === 3) ? orden[0] : orden[indice+1]
}

export function incValorDadosDefecto(acciones, umbral, incremento) {
  let inc = incremento
  let a = acciones
  for (let i=0; i<a.length; i++){
    if (a[i].dado){
      while (a[i].dado.valor < (umbral-1) && inc > 0) {
        a[i].dado.valor++
        inc--
      }
    }
  }
  for (let i=0; i<a.length; i++){
    if (a[i].dado){
      while (a[i].dado.valor < 6 && inc > 0) {
        a[i].dado.valor++
        inc--
      }
    }
  }
  return a
}

export function totalDados(acciones){
  return acciones.reduce((x,y) => {
    return x + (y.dado ? y.dado.valor : 0)
  },0)
}

export function destinoBola(hex, bolaC, bolaF, direccion, suma) {
  let hexDestino = {}
  let hexD
  let vectorDirF
  let vectorDirC
  if (Math.abs(direccion[0] - bolaF) > Math.abs(direccion[1] - bolaC)) {
    bolaC = hex.getBBox().x + hex.getBBox().width/2
    hexD = getHexagono(direccion[0], direccion[1])
    direccion[1] = hexD.getBBox().x + hexD.getBBox().width/2
    vectorDirF = direccion[0] - bolaF
    vectorDirC = direccion[1] - bolaC

    hexDestino.fila = bolaF + suma * (Math.abs(vectorDirF) / vectorDirF)
    hexDestino.columna = bolaC + (suma * vectorDirC / Math.abs(vectorDirF))
    let aux = 0
    let x = getHexagono(hexDestino.fila, aux).getBBox().x
    while (hexDestino.columna > x){
      aux++
      h = getHexagono(hexDestino.fila, aux)
      if (h) {
        x = h.getBBox().x
      }
      else {
        x = hexDestino.columna // para salir del bucle
        aux = 0
      }
    }
    hexDestino.columna = aux - 1
  }
  else {
    bolaF = hex.getBBox().y + hex.getBBox().height/2
    hexD = getHexagono(direccion[0], direccion[1])
    direccion[0] = hexD.getBBox().y + hexD.getBBox().height/2
    vectorDirF = direccion[0] - bolaF
    vectorDirC = direccion[1] - bolaC

    hexDestino.columna = bolaC + suma * (Math.abs(vectorDirC) / vectorDirC)
    hexDestino.fila = bolaF + (suma * vectorDirF / Math.abs(vectorDirC))
    let aux = 0
    let y = getHexagono(hexDestino.columna, aux).getBBox().x
    while (hexDestino.fila > y){
      aux++
      h = getHexagono(hexDestino.columna, aux)
      if (h) {
        y = h.getBBox().y
      }
      else {
        y = hexDestino.columna // para salir del bucle
        aux = 0
      }
    }
    hexDestino.fila = aux - 1
  }

  console.log("[Suma: %d] Bola: (%f, %f) - Direccion: (%f, %f) - Vector: (%f, %f) - Destino: (%f, %f)",
      suma, bolaF, bolaC, direccion[0], direccion[1], vectorDirF, vectorDirC, hexDestino.fila, hexDestino.columna )

  return hexDestino
}

export function bolaFinal(desvio, fuerza, hexagono) {
  let incFila
  let incColumna
  switch (desvio) {
    case 1:
      incFila = -1
      incColumna = 1
      break
    case 2:
      incFila = 0
      incColumna = 1
      break
    case 3:
      incFila = 1
      incColumna = 1
      break
    case 4:
      incFila = 1
      incColumna = -1
      break
    case 5:
      incFila = 0
      incColumna = -1
      break
    case 6:
      incFila = -1
      incColumna = -1
      break
    default:
      break
  }

  let fila = 0
  let columna = 0
  if (incFila === 0) {
    fila = hexagono.fila
    columna = hexagono.columna + (fuerza * incColumna)
    console.log("Desvío: %i - Fuerza: %i - Fila: %i - Columna: %i",
                     desvio,      fuerza,      fila,      columna)
  }
  else {
    fila = hexagono.fila + (fuerza * incFila)
    let incremento = ((fuerza % 2) ? (fuerza + ((hexagono.fila % 2) ? -1: 1) * incColumna ) : fuerza) * 0.5
    columna = hexagono.columna + incremento
    console.log("Desvío: %i - Fuerza: %i - Fila: %i - Columna: %i - Incremento: %i",
                     desvio,      fuerza,      fila,      columna,      incremento)
  }
  return hex = {fila, columna}
}


export function numeroCartasEvento(acciones, umbral) {
  return acciones.reduce((x,y) => {
    return x + (y.dado ? ((y.dado.valor >= umbral) ? 1 : 0) : 0)
  },0)
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
