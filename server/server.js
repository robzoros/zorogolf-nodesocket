var compression = require('compression'),
    express     = require('express'),
    path        = require('path'),
    app         = express(),
    server      = require('http').Server(app),
    io          = require('socket.io')(server),
    sockets     = require('./controladores/sockets')(io),
    mongoose    = require('mongoose'),
    morgan      = require('morgan'),
    passport	= require('passport'),
    config      = require('./config/database'); // get db config file

/*var fs          = require('fs'),
    https       = require('https'),
    key         = fs.readFileSync('./server/config/score18xx-key.pem'),
    cert        = fs.readFileSync('./server/config/score18xx-cert.pem'),
    https_options = {
        key: key,
        cert: cert
    }; */

mongoose.connect(config.database, function(err, res) {
    if(err) {
        throw err;
    } else{
        console.log('Conectado a MongoDB');
    }
});

app.use(compression());

// log to console
app.use(morgan('dev'));
// Use the passport package in our application
app.use(passport.initialize());

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, '../public'), {index: false}));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

var PORT = process.env.PORT || 8080;
server.listen(PORT, function() {
    console.log('Production Express server running at localhost:' + PORT);
});

/*
var server_port = process.env.OPENSHIFT_NODEJS_PORT || 3100;
var server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '127.0.0.1';

https.createServer(https_options, app).listen(server_port, server_ip_address, function() {
    console.log( "Listening on " + server_ip_address + ", server_port " + server_port );
}); */