import {LOCAL_STORAGE} from './constantes'
import { userLogin } from './redux/acciones-partidas'
import Store from './redux/store'
import * as Socket from './socket'

let socket

function loadUserCredentials() {
    let token = window.localStorage.getItem(LOCAL_STORAGE.TOKEN)
    if (token) {
        let name = window.localStorage.getItem(LOCAL_STORAGE.USUARIO)
        Store.dispatch(userLogin({token, name}))
    }
}

export function inicio() {
    if (!Store.getState().usuario.conectado){
        socket = Socket.conectar(socket)
    }
    loadUserCredentials()
}

export function login(usuario) {
    Socket.emitirMensaje(socket, "login", usuario)
}

export function saveUserCredentials(datos) {
    let token = datos.token
    window.localStorage.setItem(LOCAL_STORAGE.TOKEN, token)
    if (token) {
        let name = datos.name
        window.localStorage.setItem(LOCAL_STORAGE.USUARIO, name)
        Store.dispatch(userLogin({token, name}))
    }
}