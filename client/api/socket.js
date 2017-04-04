import Store from './redux/store'
import { userLogin, userConectar, obtenerPartidas } from './redux/acciones-partidas'
import { saveUserCredentials } from './sesion'


let registerBegin = function(socket, data) {
    let token = data.token
    let name = data.name
    Store.dispatch(userLogin({token, name}))
    emitirMensaje('begin', token)
}

let socket

export function conectar() {
    //socket = io.connect('http://localhost:8080', { 'forceNew': true })
    //socket = io.connect('https://127.0.0.1:3100', { 'forceNew': true });
    if (!socket) {
        socket = io.connect('https://zorogolf.zoroastro.c9users.io', { 'forceNew': true });

        // recibe confirmación de conexión
        socket.on('connect', function () {
            emitirMensaje('conectado', 'OK')
            Store.dispatch(userConectar({}))
        })
    
        // recibe confirmación de login
        socket.on('login', function (data) {
            console.log("login: ", data)
            if (data.success) {
                saveUserCredentials(data)
                registerBegin(socket, data)
            }
        })
        
        // recibe confirmación de token
        socket.on('token', function (data) {
            console.log("Token: ", data)
            if (data.success) {
                registerBegin(socket, data)
            }
        })
    
        // recibe lista de partidas
        socket.on('partidas', function (data) {
            console.log("Partidas: ", data)
            if (data.success) {
                Store.dispatch(obtenerPartidas(data.partidas))
            }
        })
    
        socket.on('ping', function(data){
            emitirMensaje('pong', {beat: 1});
        });
    }
    
}


export function emitirMensaje(tipo, datos) {
  socket.emit(tipo, datos)
  return true
}
