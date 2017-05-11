import {LOCAL_STORAGE} from './constantes'
import Store from './redux/store'
import * as Socket from './socket'
import { userLoadToken } from './redux/acciones-partidas'
import MENSAJES_SOCKET from '../../shared/server_const'

let socket

let loadUserCredentials = () => {
    let token = window.localStorage.getItem(LOCAL_STORAGE.TOKEN)
    console.log("Token: ", token)
    if (token) {
        let name = window.localStorage.getItem(LOCAL_STORAGE.USUARIO)
        console.log("Nombre: ", name)
        Store.dispatch(userLoadToken({token, name}))
        //Socket.emitirMensaje("token", token)
    }
}

export function inicio() {
    loadUserCredentials()
    if (!Store.getState().usuario.conectado ){
        socket = Socket.conectar(socket)
    }
}

export function login(usuario) {
    Socket.emitirMensaje(MENSAJES_SOCKET.LOGIN, usuario)
}

export function logout() {
    saveUserCredentials({token: "", name: ""})
}

export function crearUsuario(usuario) {
    Socket.emitirMensaje(MENSAJES_SOCKET.NUEVO_USUARIO, usuario)
}
export function saveUserCredentials(datos) {
    let token = datos.token
    window.localStorage.setItem(LOCAL_STORAGE.TOKEN, token)
    if (token) {
        let name = datos.name
        window.localStorage.setItem(LOCAL_STORAGE.USUARIO, name)
    }
}