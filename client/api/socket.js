import Store from './redux/store'
import { userConectar } from './redux/acciones-partidas'
import { saveUserCredentials } from './sesion'
export function conectar(socket) {
    socket = io.connect('http://localhost:8080', { 'forceNew': true })
    //socket = io.connect('https://127.0.0.1:3100', { 'forceNew': true });

    socket.on('connect', function () {
        emitirMensaje(socket, 'conectado', 'OK')
        Store.dispatch(userConectar({}))
    })

    socket.on('login', function (data) {
        console.log(data)
        if (data.success) {
            saveUserCredentials(data)
        }
    })

    socket.on('data', function (data) {
        console.log(data)
    })

    return socket

}


export function emitirMensaje(socket, tipo, datos) {
  socket.emit(tipo, datos)
  return true
}
