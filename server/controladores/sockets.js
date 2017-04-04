var zorogolf_db = require('./zorogolf_db');
var timeOut = 25000;


var tratarPeticion = function (socket, tipo, peticion ) {
    socket.on(tipo, function(msg) {
        console.log(tipo + ": " + socket.id)
        peticion(msg)
            .then((data) => {
                socket.emit(tipo, data)
            })
            .catch((data)=> {
                console.log(tipo + " error: ", data)
                socket.emit(tipo, data)
            })
    })
}

module.exports = function(io){
    console.log("Esperando Conexiones via Socket.io");
    io.on('connection', function(socket) {
        socket.on('conectado', function(data) {
            console.log(new Date() + ': Socket conectado:   ', socket.id);
        })

        // Desconexión
        socket.on('disconnect', function() {
            console.log(new Date() +  ': Socket desconectado:', socket.id);
        });
        
        // Tratar peticiones
        tratarPeticion(socket, 'login',  zorogolf_db.login)
        tratarPeticion(socket, 'token',  zorogolf_db.verificarToken)
        tratarPeticion(socket, 'begin',  zorogolf_db.getListaPartidas)
        

        // Gestionando Pong
        function sendHeartbeat(){
            console.log(new Date() +  ": Heartbit");
            setTimeout(sendHeartbeat, timeOut);
            socket.emit('ping', { beat : 1 });
        }

        socket.on('pong', function(data){
            console.log(new Date() +  "Pong received from client: ", socket.id);
        });

        setTimeout(sendHeartbeat, timeOut);


    })
}

