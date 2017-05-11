// Funciones para tratar distancias entre hexágonos etc
// Basado en Hexagonal Grids from http://www.redblobgames.com/grids/hexagons/

var hexObjetivo = (hexO, hexD, distancia, fuerza) => {
		var hexObj = {}
		if (!(hexO.row % 2)) hexO.col += 0.5
		if (!(hexD.row % 2)) hexD.col += 0.5
		console.log(hexO, hexD)
		hexObj.col = hexO.col + ((hexD.col - hexO.col) * fuerza/distancia)
		hexObj.row = Math.round(hexO.row + ((hexD.row - hexO.row) * fuerza/distancia))
		console.log(hexObj)

		if (hexObj.row % 2) {
			hexObj.col = Math.round(hexObj.col)
		}
		else {
			hexObj.col = Math.round(hexObj.col-0.5)
		}
		console.log(hexObj)
		return hexObj
}

var cube_distance = (a, b) => {
  return Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y), Math.abs(a.z - b.z))
}

var cube_round = (cube) => {
	var rx = Math.round(cube.x)
	var ry = Math.round(cube.y)
	var rz = Math.round(cube.z)

	var x_diff = Math.abs(rx - cube.x)
	var y_diff = Math.abs(ry - cube.y)
	var z_diff = Math.abs(rz - cube.z)

	if (x_diff > y_diff && x_diff > z_diff)
		rx = -ry-rz
	else if (y_diff > z_diff)
		ry = -rx-rz
	else
		rz = -rx-ry

	var result = {}
	result.x = rx
	result.y = ry
	result.z = rz
	return result
}

var lerp = (a, b, t) => { 
	return a + (b - a) * t
}

var cube_lerp = (a, b, t) => {
	var result = {}
	result.x = lerp(a.x, b.x, t)
	result.y = lerp(a.y, b.y, t)
	result.z = lerp(a.z, b.z, t)
	return result
}

var cube_to_evenr = (cube) => {
	var result = {}
  result.col = cube.x + (cube.z + (cube.z&1)) / 2
  result.row = cube.z
  return result
}

var evenr_to_cube = (hex) => {
	var result = {}
  result.x = hex.col - (hex.row + (hex.row&1)) / 2
  result.z = hex.row
  result.y = -1 * result.x - result.z
  return result
}

var rutaDestino = (c1, c2, N) => {
  var results = []
  for(var i=0; i<=N; i++)
    results.push(cube_to_evenr(cube_round(cube_lerp(c1, c2, 1.0/N * i))))
  console.log("RUTA: ", results)
  return results
}

exports.rutaBola = (bolaC, bolaF, direccion, fuerza) => {
	
	var hexO = {}
	hexO.col = bolaC
	hexO.row = bolaF
	
	var hexD = {}
	hexD.col = direccion[1]
	hexD.row = direccion[0]

	console.log("Hexagonos: ", hexO, hexD)
  var c1 = evenr_to_cube(hexO)
  var c2 = evenr_to_cube(hexD)
  var N = cube_distance(c1, c2) 
  console.log("C1, C2: ", c1, c2)
  console.log("N a hex inicial y fuerza: ", N, fuerza)
  
  if (N < fuerza) {
  	c2 = evenr_to_cube(hexObjetivo(hexO, hexD, N, fuerza))
  	N = cube_distance(c1, c2) 
  	console.log("N a objetivo y fuerza", N, fuerza)
  }

	return rutaDestino(c1, c2, N)
}

exports.bolaFinal = (desvio, fuerza, hexagono) => {
	console.log("Bola Final: ", hexagono)
  var incFila
  var incColumna
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

  var row = 0
  var col = 0
  if (incFila === 0) {
    row = hexagono.row
    col = hexagono.col + (fuerza * incColumna)
    console.log("Desvío: %d - Fuerza: %d - Fila: %d - Columna: %d",
                     desvio,      fuerza,      row,          col)
  }
  else {
    row = hexagono.row + (fuerza * incFila)
    var incremento = ((fuerza % 2) ? (fuerza + ((hexagono.fila % 2) ? -1: 1) * incColumna ) : fuerza) * 0.5
    col = hexagono.col + incremento
    console.log("Desvío: %d - Fuerza: %d - Fila: %d - Columna: %d - Incremento: %d",
                     desvio,      fuerza,       row,          col,      incremento)
  }
  return {row, col}
}

exports.puntoEntrada = (recorrido, ruta, distancia) => {
	var i=distancia
	do {
		i -= 1
		console.log(recorrido[ruta[i].row-1][ruta[i].col])
	} while (recorrido[ruta[i].row-1][ruta[i].col] === 'w')
	return ruta[i]
}
