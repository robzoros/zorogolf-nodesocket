export const COLORES = ['Blue', 'Red', 'White', 'Yellow']
export const LISTA_PARTIDAS = {
  SIN_EMPEZAR: 'SE',
  PROPIAS: 'PR'
}

export const CONST_HEX = {
  RATIO: 1.732050808,
  RADIO: 30,
  X_INI: 50,
  Y_INI: 30
}

export const GREEN_HEX = {
  ancho: 186.28062,
  alto: 215.09834
}


export const distanciasGreen = {
  ejeBig: ["1x1","1x2","1x3","1x4","2x1","2x2","2x3","2x4","3x1","3x2","3x3","3x4","4x1","4x2","4x3","4x4"],
  distanciasBig: [
    [0,8,16,24,8,12,20,28,12,16,20,24,20,24,28,32],
    [8,0,8,16,24,8,12,20,16,12,16,20,20,20,24,28],
    [16,8,0,8,12,8,8,12,20,16,12,16,24,20,20,24],
    [24,16,8,0,20,12,8,8,24,20,16,12,28,24,20,20],
    [8,24,12,20,0,8,16,24,8,8,12,20,12,16,20,24],
    [12,8,8,12,8,0,8,16,12,8,8,12,16,12,16,20],
    [20,12,8,8,16,8,0,8,20,12,8,8,20,16,12,16],
    [28,20,12,8,24,16,8,0,28,20,12,8,24,20,16,12],
    [12,16,20,24,8,12,20,28,0,8,16,24,8,12,20,28],
    [16,12,16,20,8,8,12,20,8,0,8,16,8,8,12,20],
    [20,16,12,16,12,8,8,12,16,8,0,8,12,8,8,20],
    [24,20,16,12,20,12,8,8,24,16,8,0,20,12,8,8],
    [20,20,24,28,12,16,20,24,8,8,12,20,0,8,16,24],
    [24,20,20,24,16,12,16,20,12,8,8,12,8,0,8,16],
    [28,24,20,20,20,16,12,16,20,12,8,8,16,8,0,8],
    [32,28,24,20,24,20,16,12,28,20,20,8,24,16,8,0]
  ],
  ejeSmall: ["1x1","1x2","1x3","2x1","2x2","2x3","3x1","3x2","3x3","4x1","4x2","4x3","5x1","5x2","5x3","6x1","6x2","6x3"],
  distanciaSmall: [
    [0,1,2,1,2,3,2,3,4,2,3,4,2,3,4,1,2,3],
    [1,0,1,2,2,3,3,4,5,3,4,5,3,4,5,2,2,3],
    [2,1,0,3,3,3,4,5,6,4,5,6,4,5,6,3,3,3]
  ]
}

export const COLOR_ROUGH = "#008000"
export const COLOR_FOREST = "#552200"
export const COLOR_FAIRWAY = "#00ff00"
export const COLOR_SAND = "#ffff00"
export const COLOR_GREEN = "#ffff00"
export const COLOR_WATER = "#000080"
export const COLOR_TEE = "#ff0000"
export const COLOR_STROKE = "#ffffff"
export const COLOR_STROKE_GREEN = "#00ff00"
export const STROKE = 3

export const ESTILOS_HEX = [
  {fill: COLOR_ROUGH, fillOpacity:"1", stroke: COLOR_STROKE , strokeWidth: STROKE},
  {fill: COLOR_FOREST, fillOpacity:"1", stroke: COLOR_STROKE , strokeWidth: STROKE},
  {fill: COLOR_FAIRWAY, fillOpacity:"1", stroke: COLOR_STROKE , strokeWidth: STROKE},
  {fill: COLOR_SAND, fillOpacity:"0.33", stroke: COLOR_STROKE , strokeWidth: STROKE},
  {fill: COLOR_GREEN, fillOpacity:"1", stroke: COLOR_STROKE_GREEN , strokeWidth: STROKE},
  {fill: COLOR_WATER, fillOpacity:"1", stroke: COLOR_STROKE , strokeWidth: STROKE},
  {fill: COLOR_TEE, fillOpacity:"1", stroke: COLOR_STROKE , strokeWidth: STROKE},
  {fill: COLOR_GREEN, fillOpacity:"1", stroke: COLOR_TEE , strokeWidth: STROKE*2},
]

export const INDICE_ESTILOS = "rfysgwtl"

export const PREFIJO_CARTAS = {
  CARTAS_BACK_ACCION: "/img/CartasBack/CBA_",
  CARTAS_BACK_PALO: "/img/CartasBack/CBP_"
}

export const CARTAS_PALOS = {
  DIR: "/img/CartasPalo/",
  FILES: [
    "Club_W1.png",
    "Club_W3.png",
    "Club_I3.png",
    "Club_I5.png",
    "Club_I7.png",
    "Club_I9.png",
    "Club_PW.png",
    "Club_SW.png"
  ]
}

export const ESTADOS_JUEGO = {
  INICIO: "INICIO",
  GOLPE_INICIADO: 'GOLPE_INICIADO',
  ACCIONES: "ACCIONES"
}

export const ESTADO_JUGADOR = {
  ESPERANDO: 'WAITING',
  GOLPE: 'STROKE',
  ACCION: 'ACTION',
  ACCION_PREVIA: 'PREVIOUS ACTION',
  TURNO: 'TURN', //ESPERANDO TURNO
  GREEN: 'GREEN',
  ENTRANDO_GREEN: 'TO GREEN',
  FIN_HOYO: 'HOLE IN',
  FIN_ACCIONES: 'FIN_ACCIONES'
}

export const ESTADO_PARTIDA = {
  ESPERANDO: 'E',
  GOLPE: 'G',
  ACCION: 'A',
  TURNO: 'T', //ESPERANDO TURNO
  ACCION_PREVIA: 'R',
  GREEN: 'N',
  ENTRANDO_GREEN: 'Y',
  FIN_HOYO: 'F',
  FIN_ACCIONES: 'C'
}

export const LOCAL_STORAGE = {
  TOKEN: 'Token-Zorogolf',
  USUARIO: 'User-Zorogolf'
}