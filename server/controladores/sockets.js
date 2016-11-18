var  jwt         = require('jwt-simple'),
     User        = require('../models/user'), // get the mongoose model
     config      = require('../config/database'); // get db config file
     zorogolf_db = require('./zorogolf_db');

var messages = [{
    id: 1,
    text: "Hola soy un mensaje",
    author: "Carlos Azaustre"
}];

var verificaToken = function(token){
    return new Promise ( function(resolve, reject) {
        if (token) {
            //var decoded = jwt.decode(token, config.secret);
            //User.findOne({name: decoded.name}, function(err, user) {
            User.findOne({name: 'zoro'}, function(err, user) {
                if (err) {
                    console.log(err);
                    reject(err);
                }
                if (!user) {
                    console.log('Authentication failed. User not found.');
                    reject('Authentication failed. User not found.');
                }
                resolve({success: true});
            });
        }
        else {
            console.log('Authentication failed. Token not found.');
            reject('Authentication failed. Token not found.');
        };
    });
};


module.exports = function(io){
    io.on('connection', function(socket) {
        socket.on('conectado', function(data) {
            console.log(new Date() + ': Alguien se ha conectado con Sockets.');
        })

        socket.on('login', function(data) {
            console.log('Login %O', data)
            zorogolf_db.login(data)
                .then((data) => {
                    console.log('Then %O', data)
                    io.sockets.emit('login', data);
                })
                .catch((data)=> {
                    console.log('Catch %O', data)
                    io.sockets.emit('login', data);
                })
        });
    });
};

