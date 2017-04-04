import {LOCAL_STORAGE} from './constantes'
import Store from './redux/store'
import * as Socket from './socket'

let socket

function loadUserCredentials() {
    let token = window.localStorage.getItem(LOCAL_STORAGE.TOKEN)
    console.log("Token: ", token)
    if (token) {
        let name = window.localStorage.getItem(LOCAL_STORAGE.USUARIO)
        Socket.emitirMensaje("token", token)
    }
}

export function inicio() {
    if (!Store.getState().usuario.conectado){
        socket = Socket.conectar(socket)
    }
    loadUserCredentials()
}

export function login(usuario) {
    Socket.emitirMensaje("login", usuario)
}

export function saveUserCredentials(datos) {
    let token = datos.token
    window.localStorage.setItem(LOCAL_STORAGE.TOKEN, token)
    if (token) {
        let name = datos.name
        window.localStorage.setItem(LOCAL_STORAGE.USUARIO, name)
    }
}