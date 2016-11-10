var compression = require('compression'),
    express = require('express'),
    path = require('path'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server);

var messages = [{
  id: 1,
  text: "Hola soy un mensaje",
  author: "Carlos Azaustre"
}];

app.use(compression());

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, '../public'), {index: false}));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

io.on('connection', function(socket) {
    console.log(new Date() + ': Alguien se ha conectado con Sockets.');
    socket.emit('messages', messages);

    socket.on('new-message', function(data) {
        messages.push(data);

        io.sockets.emit('messages', messages);
    });
});

var PORT = process.env.PORT || 8080;
server.listen(PORT, function() {
    console.log('Production Express server running at localhost:' + PORT);
});