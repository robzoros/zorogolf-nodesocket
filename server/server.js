import React from 'react'
import path from 'path'
import compression from 'compression'
import { renderToString } from 'react-dom/server'
import { match, RouterContext } from 'react-router'
import routes from '../public/app/api/routes.jsx'
import express from 'express'

var app = express()
var server = require('http').Server(app)
var io = require('socket.io')(server)

var messages = [{
  id: 1,
  text: "Hola soy un mensaje",
  author: "Carlos Azaustre"
}];

app.use(compression())
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, '../public'))

// serve our static stuff like index.css
app.use(express.static(path.join(__dirname, '../public'), {index: false}))

app.get('*', (req, res) => {
    match({ routes, location: req.url }, (err, redirect, props) => {
        console.log(req.url)
        if (err) {
            res.status(500).send(err.message)
        } else if (redirect) {
            res.redirect(redirect.pathname + redirect.search)
        } else if (props) {
            // hey we made it!
            const appHtml = renderToString(<RouterContext {...props}/>)
            return res.render('index', { markup: appHtml });
        } else {
            res.status(404).send('Not Found')
        }
    })
})

io.on('connection', function(socket) {
    console.log(new Date() + ': Alguien se ha conectado con Sockets.');
    socket.emit('messages', messages);

    socket.on('new-message', function(data) {
        messages.push(data);

        io.sockets.emit('messages', messages);
    });
});

var PORT = process.env.PORT || 8080
server.listen(PORT, function() {
    console.log('Production Express server running at localhost:' + PORT)
})