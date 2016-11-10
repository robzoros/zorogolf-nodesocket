export const ACCIONES_REDUX = {
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  EMPEZAR_PARTIDA: 'EMPEZAR_PARTIDA',
  NUEVA_PARTIDA: 'NUEVA_PARTIDA',
  NUEVO_JUGADOR: 'NUEVO_JUGADOR',
  ACTUALIZAR_JUGADORES: 'ACTUALIZAR_JUGADORES',
  ADD_CAMPO: 'ADD_CAMPO',
  COORDENADAS_BANDERA: 'COORDENADAS_BANDERA',
  SIZE_HOYO: 'SIZE_HOYO',
  ESTADO_HOYO: 'ESTADO_HOYO',
  GOLPE_INICIADO: 'GOLPE_INICIADO'
}

export function userLogin(usuario) {
  return{
    type: ACCIONES_REDUX.LOGIN,
    usuario
  };
};

export function userLogout(usuario) {
  return{
    type: ACCIONES_REDUX.LOGOUT,
    usuario
  };
};


export function empezarPartida(partida) {
  return{
    type: ACCIONES_REDUX.EMPEZAR_PARTIDA,
    partida
  };
};

export function nuevaPartida(partida) {
  return{
    type: ACCIONES_REDUX.NUEVA_PARTIDA,
    partida
  };
};

export function nuevoJugador(jugador) {
  return{
    type: ACCIONES_REDUX.NUEVO_JUGADOR,
    jugador
  };
};

export function addCampo(hoyos) {
  return{
    type: ACCIONES_REDUX.ADD_CAMPO,
    hoyos
  };
};

export function coordenadasBandera(coordenadas) {
  return{
    type: ACCIONES_REDUX.COORDENADAS_BANDERA,
    coordenadas
  };
};

export function sizeHoyo(size) {
  return{
    type: ACCIONES_REDUX.SIZE_HOYO,
    size
  };
};

export function setEstadoHoyo(hoyo_actual) {
  return{
    type: ACCIONES_REDUX.ESTADO_HOYO,
    hoyo_actual
  };
};

export function actualizarJugadores(jugadores) {
  return{
    type: ACCIONES_REDUX.ACTUALIZAR_JUGADORES,
    jugadores
  };
};
