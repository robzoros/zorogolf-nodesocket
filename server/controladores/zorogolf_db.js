var Partida = require('../models/partida.js');
var Juego   = require('../models/juego.js');
var User    = require('../models/user.js');
var jwt     = require('jwt-simple');
var config  = require('../config/database'); // get db config file
var global

// Promesa para verificar usuario
function verificarUsuario (req, res) {
    return new Promise ( function(resolve, reject) {
        User.findOne({name: req.body.usuario}, function(err, user) {
            if (err) {
                console.log(err);
                return res.status(500).send(err.message);
            };

            if (!user) {
                console.log('Authentication failed. User not found.');
                return res.status(403).send('Authentication failed. User not found.');
            } 
            else {
                resolve(req, res);
            };
        });
    });
};

// Promesa para verificar token y usuario administrador
function verificarToken (req, res, needAdmin) {
    return new Promise ( function(resolve, reject) {
        var token = global.getToken(req.headers);
        if (token) {
            var decoded = jwt.decode(token, config.secret);
            User.findOne({name: decoded.name}, function(err, user) {
                console.log(user);
                if (err) {
                    console.log(err);
                    return res.status(500).send( err.message);
                };

                if (!user) {
                    console.log('Authentication failed. User not found.');
                    return res.status(403).send('Authentication failed. User not found.');
                } 

                if (needAdmin && (user.rol !== "Administrador")) {
                    console.log('El usuario %s no tiene privilegios sobre la tabla juegos.', user.name);
                    return res.status(403).send('El usuario ' + user.name + ' no tiene privilegios sobre la tabla juegos.');
                }
                resolve(req, res);
            });
        }
        else {
            console.log('Authentication failed. Token not found.');
            return res.status(403).send('Authentication failed. Token not found.');
        };
    });

};

// Funciones que llamarán en las promesas
actualizaPartida = function (req, res) {
    Partida.findById(req.params.id, function(err, partida) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        };
        if (partida.usuario === req.body.usuario) {
            partida.nombre = req.body.nombre;
            partida.juego = req.body.juego;
            partida.loc = req.body.loc;
            partida.fecha = req.body.fecha;
            partida.jugadores = req.body.jugadores;
            partida.empresas = req.body.empresas;
            partida.dividendos = req.body.dividendos;

            partida.save(function(err){
                if (err) {
                    console.log(err);
                    return res.status(500).send(err.message);
                };
                res.status(200).jsonp(partida);
            });
        }
        else {
            console.log('La partida no pertenece al usuario.');
            return res.status(403).send('La partida no pertenece al usuario.');
        }
    });    
};

nuevaPartida = function(req, res) {
    // Creamos partida
    var jugadores = {};
    jugadores.numero = req.body.jugadores;
    var part = new Partida({
        usuario:   	req.body.usuario,
        nombre:   	req.body.nombre,
        jugadores:      jugadores,
        juego:    	req.body.juego,
        loc: 		req.body.loc,
        fecha:    	req.body.fecha
    });

    part.save(function(err) {
        if(err){
            console.log(err);
            return res.status(500).send( err.message);
        }
        res.status(200).jsonp(part);
    });
};

nuevoJuego = function(req, res) {
    var juego = new Juego({
        _name:   	req.body._name,
        _id:            req.body._id,
        description:    req.body.description,
        companies:    	req.body.companies
    });
    juego.save(function(err) {

        if (err) {
            console.log(err);
            return res.status(500).send( err.message);
        };
        res.status(200).jsonp(juego);
    }); 
};

deleteJuego = function(req, res) {
    console.log(req.params);
    var resp = res;
    Juego.findById(req.params.id, function(err, juego) {
        console.log(juego);        
        juego.remove(function(err) {
            if (err) {
                console.log(err);
                return res.status(500).send( err.message);
            };
            console.log('Borrando');     
            resp.status(200).send();
        });
    });
};
        
actualizarJuego = function(req, res) {
    var resp = res;    
    Juego.findById(req.params.id, function(err, juego) {
        if (err) {
            console.log(err);
            return res.status(500).send( err.message);
        };
        juego._name = req.body._name;
        juego.description = req.body.description;
        juego.companies = req.body.companies;

        juego.save(function(err){
            if (err) {
                console.log(err);
                return resp.status(500).send( err.message);
            };
            res.status(200).jsonp(juego);
        });
    });
};

obtenerPartida = function (req, res) {
    Partida.findById(req.params.id, function(err, partida) {
        if(err){
            console.log(err);
            return res.status(500).send(err.message);
        }
        else {
            if (partida)
                res.status(200).jsonp(partida);
            else
                res.status(404).send("Partida no encontrada");
        }
    });
};

//CRUD Partidas
exports.addPartida = function(req, res) {
    verificarUsuario(req, res).then( function() {
        nuevaPartida(req, res);
    });
};

exports.getPartida = function(req, res) {  
    //verificarToken(req, res, false).then( function() {
        obtenerPartida(req, res);
    //});
};

exports.getListaPartidas = function(req, res) {  
    //console.log('GET /lista');
    var token = global.getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);
    
        Partida.find({usuario: decoded.name}, function(err, partidas) {
            if(err){
                console.log(err);
                return res.status(500).send(err.message);
            }
            res.status(200).jsonp(partidas);
        });
    }
    else {
        console.log('Authentication failed. Token not found.');
        return res.status(403).send('Authentication failed. Token not found.');
    };
};

exports.putPartida = function(req, res) {  
    verificarUsuario(req, res).then( function(){
        actualizaPartida(req, res);
    });
};
   
    
exports.borrarPartida = function(req, res) {
    var token = global.getToken(req.headers);
    if (token) {
        var decoded = jwt.decode(token, config.secret);

        Partida.findById(req.params.id, function(err, partida) {
            if (partida.usuario === decoded.name) {
                partida.remove(function(err) {
                    if (err) {
                        console.log(err);
                        return res.status(500).send(err.message);
                    };
                    res.status(200).send();
                });
            }
            else {
                console.log('La partida no pertenece al usuario.');
                return res.status(403).send('La partida no pertenece al usuario.');
            }
        });    
    }
    else {
        console.log('Authentication failed. Token not found.');
        return res.status(403).send('Authentication failed. Token not found.');
    };
    
};

//CRUD Juegos
exports.addJuego = function(req, res) {  
    verificarToken(req, res, true).then( function () {
        nuevoJuego(req, res);
    });
};

exports.getJuegos = function(req, res) {  
    //console.log('GET /juegos');
    
    Juego.find(function(err, juegos) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        };
        res.status(200).jsonp(juegos);
    });
};

exports.getJuego = function(req, res) {  
    //console.log('GET /juego id: ' +req.params.id);
    
    Juego.findById(req.params.id,function(err, juego) {
        if (err) {
            console.log(err);
            return res.status(500).send(err.message);
        };
        if (juego)
            res.status(200).jsonp(juego);
        else
            res.status(404).send("Juego no encontrado");
    });
};

exports.putJuego = function(req, res) {  
    verificarToken(req, res, true).then(function() {
        actualizarJuego(req, res);
    });
};   
    
exports.borrarJuego = function(req, res) {
    verificarToken(req, res, true).then( function() {
        deleteJuego(req, res);
    });
};

// usuarios
exports.crearUsuario = function(req, res) {
    //console.log('POST /signup');
    if (!req.body.name || !req.body.password) {
        res.json({success: false, msg: 'Please pass name and password.'});
    } else {
        var newUser = new User({
            name: req.body.name,
            password: req.body.password,
            rol: "Consulta"
        });

        // save the user
        newUser.save(function(err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.'});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }    
};

exports.login = function(datos) {
    return new Promise ( function(resolve, reject) {
        console.log('FIND User %O', datos );
        User.findOne({
            name: datos.name
        }, function (err, user) {
            console.log('FIND User %O', user );

            if (err)
                reject(err);

            if (!user) {
                reject("User not found");
            } else {

                // check if password matches
                user.comparePassword(datos.password, function (err, isMatch) {
                    console.log('Compare Pass');

                    if (isMatch && !err) {
                        // if user is found and password is right create a token
                        var token = jwt.encode(user, config.secret);
                        // return the information including token as JSON
                        resolve ({success: true, token: 'JWT ' + token, name: user.name, rol: user.rol});
                    } else {
                        console.log('Not Compare Pass');

                        reject('Authentication failed. Wrong password.');
                    }
                });
            }
        });
    });
};

