import React, {Component} from 'react';
import Hexagono from '../ui/hexagono.jsx';
import {ESTILOS_HEX, INDICE_ESTILOS, CONST_HEX, GREEN_HEX} from './constantes'
import {coordenadasBandera} from './redux/acciones-partidas'

export function centroHexagono(ficha) {
  let fila = ficha.fila -1
  let xINIParImpar = CONST_HEX.X_INI + ( (fila % 2) ? (CONST_HEX.RADIO * CONST_HEX.RATIO / 2) : 0 )

  ficha.cy = CONST_HEX.Y_INI + (fila * CONST_HEX.RADIO * 1.5)
  ficha.cx = xINIParImpar + (ficha.columna * (CONST_HEX.RADIO * CONST_HEX.RATIO))
  return ficha
}

export var datosCampo = {
  tee_cx:0,
  tee_cy:0,
  tee_fila: 0,
  tee_columna: 0,
  campo_largo: 0,
  campo_ancho: 0,
}

let hexagonoBandera

let dimensionGreen = (losetas) => {
  return losetas.reduce ((dimension, loseta) => {
    let ls = loseta.split('x')
    dimension[0] = ls[0] > dimension[0] ? ls[0] : dimension[0]
    dimension[1] = ls[1] > dimension[1] ? ls[1] : dimension[1]
    return dimension
  }, [0,0])
}

export function renderRecorrido (recorrido) {
  let filas = []
  let fila = 0
  let avanceX = CONST_HEX.RADIO * CONST_HEX.RATIO / 2
  let x = CONST_HEX.X_INI
  let y = CONST_HEX.Y_INI

  for(let i=recorrido.length-1; i>=0; i--){
    for(let j=0; j<recorrido[i].num;j++){
      fila++
      filas.push(filaHex(x,y, fila, recorrido[i].mapa))
      x = CONST_HEX.X_INI + ((fila % 2) ? avanceX:0)
      y = y + CONST_HEX.RADIO * 1.5

    }
  }
  filas.push(hexagonoBandera)
  return filas
}

let filaHex = (cx, cy, fila, cadena) => {
  let cx_aux = cx
  let hexagonos = cadena.split('').map((hex, i) => {
    if (hex !== 0) {
      let id = fila + "x" + i
      let cx_m = cx_aux
      cx_aux += (CONST_HEX.RADIO * CONST_HEX.RATIO)

      let estilo = ESTILOS_HEX[INDICE_ESTILOS.indexOf(hex)]

      if(hex==='t'){
        datosCampo.tee_cx = cx_m
        datosCampo.tee_cy = cy
        datosCampo.tee_fila = fila
        datosCampo.tee_columna = i
      }

      datosCampo.campo_ancho = (datosCampo.campo_ancho < cx_m) ? cx_m + CONST_HEX.RADIO*2 : datosCampo.campo_ancho;
      datosCampo.campo_largo = (datosCampo.campo_largo < cy) ? cy : datosCampo.campo_largo;

      let hexagono = <Hexagono
        key={id}
        id={id}
        estilo={estilo}
        cx={cx_m}
        cy={cy}
        radio={CONST_HEX.RADIO}
        ratio={CONST_HEX.RATIO} />

      if (hex==='l') hexagonoBandera = hexagono

      if (estilo)
        return hexagono
    }
  })

  return hexagonos
}

export function renderGreen(green, bolas) {
  let mapaGreen= [
    { desde:2, hasta:5},
    { desde:2, hasta:6},
    { desde:1, hasta:6},
    { desde:1, hasta:7},
    { desde:1, hasta:6},
    { desde:2, hasta:6},
    { desde:2, hasta:5},
    { desde:3, hasta:5}
  ]
  let mapaNumeros = [
    { col: 3, fila: 3, numero: 1 },
    { col: 4, fila: 3, numero: 2 },
    { col: 4, fila: 4, numero: 3 },
    { col: 3, fila: 5, numero: 4 },
    { col: 2, fila: 4, numero: 5 },
    { col: 2, fila: 3, numero: 6 }
  ]
  let dimension = dimensionGreen(green.losetas)
  let estilo = {display:"inline", fill:"#99ff66", stroke:"#990000", strokeWidth:"0.3"}
  let estiloBandera= {display:"inline", fill:"#ff0000", stroke:"#990000", strokeWidth:"0.3"}
  let estiloCentro = {display:"inline",fill:"#338000",stroke:"#13dc13",strokeWidth:"2.4"}
  let hexagonos = []
  let numeros = []
  let fichas = []
  let radio = CONST_HEX.RADIO //+ Math.round(CONST_HEX.RADIO/3)
  let avanceY = radio * CONST_HEX.RATIO / 2

  green.losetas.map( (loseta) => {
    let l = loseta.split('x')
    for(let i=0; i<mapaGreen.length; i++) {
      for( let j=mapaGreen[i].desde; j<=mapaGreen[i].hasta; j++) {
        let col = i+((l[1]-1)*8) + (l[0] % 2 ? 0 : 4)
        let fila = j+((l[0]-1)*5)
        let id = col + 'x' + fila
        let cx = CONST_HEX.X_INI + (col * radio * 1.5)
        let cy = ((col % 2) ? 0: avanceY) + (fila * radio * CONST_HEX.RATIO)
        let bandera = (green.losetas[green.hexagonos.indexOf(green.bandera.hexagono)] === loseta)
        let e = (i===3 && j===4) ? estiloCentro : (green.bandera.lugar === i+'x'+j) && bandera ? estiloBandera : estilo
        hexagonos.push (<Hexagono
          key={id}
          id={id}
          estilo={e}
          cx={cx}
          cy={cy}
          radio={radio}
          ratio={CONST_HEX.RATIO}
          rotado={true} />)
      }
    }
    let numerosLoseta = numerosLoseta = mapaNumeros.map(num => {
      let col = num.col + ((l[1]-1)*8) + (l[0] % 2 ? 0 : 4)
      let fila = num.fila + ((l[0]-1)*5)
      let cx = CONST_HEX.X_INI + col * radio * 1.5
      let cy = ((col % 2) ? 0: avanceY) + (fila * radio * CONST_HEX.RATIO)
      return( <text key={loseta + "xtext" + num.numero} id={loseta + "xtext" + num.numero} y={cy} x={cx}
                    style={{fontStyle:"normal",fontVariant:"normal",fontWeight:"bold",fontStretch:"normal",fontSize:"40px",fontFamily:"Arial",fill:"#0000ff", alignmentBaseline:"middle", textAnchor:"middle"}}>
                {num.numero}
              </text>)
    })
    numeros = numeros.concat(numerosLoseta)
    let fichasLoseta = bolas ? (bolas.map(bola => {
      if (bola && bola.loseta === loseta){
        let col = bola.green_columna ? bola.green_columna : 3 + ((l[1]-1)*8) + (l[0] % 2 ? 0 : 4)
        let fila = bola.green_fila ? bola.green_fila : 4 + ((l[0]-1)*5)
        let cx = CONST_HEX.X_INI + col * radio * 1.5
        let cy = ((col % 2) ? 0: avanceY) + (fila * radio * CONST_HEX.RATIO)
        return <circle key={"bolaGreen" + bola.color} cx={cx} cy={cy} r="15" stroke="black" strokeWidth="1" fill={bola.color} />
      }
      else return null
    })) : []
    fichas = fichas.concat(fichasLoseta)
  })

  let ancho = CONST_HEX.X_INI + (dimension[1]*8) * (radio * 1.5)
  let largo = CONST_HEX.Y_INI + ((7 + (5 * (dimension[0]-1))) * radio * CONST_HEX.RATIO)
  let greenRenderized = (
    <svg className="img-fluid" width="800" height={800*largo/ancho} viewBox={"0 0 " + ancho + " " +  largo} version="1.1">
      {hexagonos}
      {numeros}
      {fichas}
    </svg>
  )

  return greenRenderized
}

export function greenBbox(losetas) {
  losetas.forEach( loseta => {
    let idH = loseta + "xhexTotal"
    let elementoH = document.getElementById(idH)
    let bboxH = elementoH.getBBox();
    let cxH = parseFloat((bboxH.x + bboxH.width/2).toFixed(4))
    let cyH = parseFloat((bboxH.y + bboxH.height/2).toFixed(4))
    let xforms = elementoH.getAttribute('transform');
    let parts  = /translate\(\s*([^\s,)]+)[ ,]([^\s,)]+)/.exec(xforms);
    let firstX = parts[1],
        firstY = parts[2];
    console.log("IDH, CX, CY, %s, %s, %s, %f, %f",idH, firstX, firstY, cxH, cyH)
    for(let i=1; i<=6; i++) {
      for(let j=1;j<=3;j++){
        let id = loseta + "x" + i + "x" + j
        let elemento = document.getElementById(id)
        let bbox = elemento.getBBox();
        let cx = parseFloat((bbox.x + bbox.width/2).toFixed(4))
        let cy = parseFloat((bbox.y + bbox.height/2).toFixed(4))
        console.log("ID, CX, CY; %s, %f, %f", id, cx, cy)
      }
    }
  })
}
