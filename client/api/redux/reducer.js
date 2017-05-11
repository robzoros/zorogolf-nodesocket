//noinspection JSUnresolvedVariable
import { combineReducers } from 'redux'
import { ACCIONES_REDUX } from './acciones-partidas'

const initialState = { empezar: true }
const inicioUsuario = {
  conectado: false,
  logado: false,
  crearCuenta: false
}
const inicioPartidas = { vacio: true } 

let usuario = (state = inicioUsuario, action) => {
  switch (action.type) {
    case ACCIONES_REDUX.CONECTAR:
      return {
        ...state,
        conectado: true
      }
    case ACCIONES_REDUX.LOGIN:
    case ACCIONES_REDUX.TOKEN:
      return {
        ...state,
        logado: true,
        name: action.usuario.name,
        token: action.usuario.token
      }
    case ACCIONES_REDUX.LOGOUT:
      return {
        conectado: false,
        logado: false,
        crearCuenta: false,
        name: null,
        token: null
      }
    default:
      return state
  }
}

let datos = (state = initialState, action) => {
  switch (action.type) {
    case ACCIONES_REDUX.LOGOUT:
    case ACCIONES_REDUX.EMPEZAR_PARTIDA:
      return {
        empezar:true
      }
    case ACCIONES_REDUX.NUEVA_PARTIDA:
      return {
        empezar: false,
        id: action.partida.id,
        nombre: action.partida.nombre,
        jugadores: action.partida.jugadores,
        campo: action.partida.campo
      }
    case ACCIONES_REDUX.NUEVO_JUGADOR:
      console.log(state, action)
      console.log(state.jugadores)
      return {
        ...state,
        jugadores: [...state.jugadores, action.jugador]
      }
    case ACCIONES_REDUX.COORDENADAS_BANDERA:
      return {
        ...state,
        coordenadas_bandera: action.coordenadas
      }
    case ACCIONES_REDUX.SIZE_HOYO:
      return {
        ...state,
        size: action.size
      }
    case ACCIONES_REDUX.ACTUALIZAR_JUGADORES:
      return {
        ...state,
        jugadores: action.jugadores
      }
    default:
      return state
  }
}

let hoyos = (state = [], action) => {
  switch (action.type) {
    case ACCIONES_REDUX.LOGOUT:
    case ACCIONES_REDUX.EMPEZAR_PARTIDA:
      return null
    case ACCIONES_REDUX.NUEVA_PARTIDA:
      return (action.partida.hoyos ? action.partida.hoyos : null )
    case ACCIONES_REDUX.ADD_CAMPO:
      return action.hoyos
    default:
      return state
  }
}

let hoyo_actual = (state = {}, action) => {
  switch (action.type) {
    case ACCIONES_REDUX.LOGOUT:
    case ACCIONES_REDUX.EMPEZAR_PARTIDA:
      return null
    case ACCIONES_REDUX.NUEVA_PARTIDA:
      return (action.partida.hoyo_actual ? action.partida.hoyo_actual : null)
    case ACCIONES_REDUX.ESTADO_HOYO:
      return action.hoyo_actual
    case ACCIONES_REDUX.GOLPE_INICIADO:
      return action.hoyo_actual
    default:
      return state
  }
}

let eventos = (state = {}, action) => {
  switch (action.type) {
    case ACCIONES_REDUX.NUEVA_PARTIDA:
      return action.partida.eventos
    default:
      return state
  }
}

let partidas =  (state = [], action) => {
  switch (action.type) {
    case ACCIONES_REDUX.OBTENER_PARTIDAS:
      return action.partidas
    default:
      return state
  }
}

const rootReducer = combineReducers({
  usuario,
  datos,
  hoyos,
  hoyo_actual,
  eventos,
  partidas
})

export default rootReducer
