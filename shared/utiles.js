// Barajamos Mazo
var shuffleDeckRecursive = (mazo, mazoAux) => {
  if (mazo.length) {
    var carta = Math.floor((Math.random() * mazo.length))
    mazoAux.push(mazo[carta])
    mazo.splice(carta,1)
    return shuffleDeckRecursive(mazo, mazoAux)
  }
  else {
    return mazoAux
  }
}

// Construimos campo
exports.getRecorrido = (recorrido) => {
  var mapa = []
  recorrido.forEach((linea) => {
    for(var i=0;i<linea.num;i++) mapa = mapa.concat(linea.mapa) 
  })
  return mapa.reverse()
}

// Mazo barajado
exports.shuffleDeck = (mazo, mazoAux) => {
  return shuffleDeckRecursive(mazo, mazoAux)
}

exports.contarEstados = (estado, lista) => {
  return estado.reduce((x,y) => { return x + (lista.indexOf(y) < 0 ? 0 : 1) }, 0)
}

exports.getDados = (numero) => {
  var dados = []
  for (var i=0; i< numero; i++){
    dados.push((Math.floor(Math.random() *  6) + 1))
  }
  return dados.sort((a, b) => {return a-b})
}

exports.incValorDadosDefecto = (acciones, umbral, incremento) => {
  var inc = incremento
  var a = acciones
  for (var i=0; i<a.length; i++){
    if (a[i].utilizado){
      while (a[i].dado.valor < (umbral-1) && inc > 0) {
        a[i].dado.valor++
        inc--
      }
    }
  }
  for (var i=0; i<a.length; i++){
    if (a[i].utilizado){
      while (a[i].dado.valor < 6 && inc > 0) {
        a[i].dado.valor++
        inc--
      }
    }
  }
  return a
}

exports.totalDados = (acciones) => {
  return acciones.reduce((x,y) => {
    return x + (y.dado ? y.dado.valor : 0)
  },0)
}


exports.numeroCartasEvento = (acciones, umbral) => {
  return acciones.reduce((x,y) => {
    return x + (y.dado ? ((y.dado.valor >= umbral) ? 1 : 0) : 0)
  },0)
}
