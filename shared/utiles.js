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

exports.shuffleDeck = (mazo, mazoAux) => {
  return shuffleDeckRecursive(mazo, mazoAux)
}

