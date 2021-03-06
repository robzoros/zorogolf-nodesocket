import { connect } from 'react-redux'
import React, {Component} from 'react'
import { Link, browserHistory } from 'react-router'
import CuentasWrapper from './form_cuenta.jsx'
import { empezarPartida } from '../api/redux/acciones-partidas'
import Store from '../api/redux/store'
import { login, crearUsuario } from  '../api/sesion'
import * as Socket from '../api/socket'

export default class Principal extends Component {
    constructor(props) {
        super(props)
        this.newGame = this.newGame.bind(this)
    }

    cambiarPassword (){
        let passRepetida = document.getElementById("login-password-again").value
        let user = {
            name: document.getElementById("login-username").value,
            password: document.getElementById("login-password").value
        }
        if (passRepetida === user.password)
            console.log("Cambiar Password")
    }

    login() {
        let usuario = {
            name: document.getElementById("login-username").value,
            password: document.getElementById("login-password").value
        }
        console.log("Login user %o", usuario)
        login(usuario)

    }

    crearCuenta(){
        let passRepetida = document.getElementById("login-password-again").value
        let user = {
            name: document.getElementById("login-username").value,
            password: document.getElementById("login-password").value,
            email: document.getElementById("login-email").value
        }
        if (passRepetida === user.password)
            crearUsuario(user)
        else
            console.log("Password erronea")
    }

    newGame(){
        Store.dispatch(empezarPartida({}))
        browserHistory.push('/partidas')
    }


    render(){
        return (
            <div className="container enlinea">
                <BarraNav newGame={this.newGame} cambiarPassword={this.cambiarPassword} login={this.login} crearCuenta={this.crearCuenta} />
                {this.props.children}
            </div>
        )
  }

}

class BarraNav extends Component{ 
    constructor(props) {
        super(props)

        this.mensaje = this.mensaje.bind(this)
        this.salvarPartida = this.salvarPartida.bind(this)
        this.pruebaPartida = this.pruebaPartida.bind(this)
    }
  
    mensaje() {
        Socket.emitirMensaje("MENSAJE", "EMITIR SALA")
    }

    salvarPartida() {
        console.log("SALVAR PARTIDA A FICHERO")
        Socket.emitirMensaje("SALVAR", Store.getState().datos.id)
    }

    pruebaPartida() {
        console.log("PRUEBA PARTIDA ")
        Socket.emitirMensaje("EJECUTAR", {id: Store.getState().datos.id})
    }


    render() {
        return (
            <nav className="navbar navbar-toggleable-sm navbar-inverse fixed-top bg-inverse bg-faded">
                <button className="navbar-toggler navbar-toggler-right" type="button" data-toggle="collapse" data-target="#menuprincipal" 
                        aria-controls="navbarTogglerDemo02" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <a className="navbar-brand" onClick={this.props.newGame}><img alt="Zorogolf" className="imagenLogo" src="../img/LogoletraClaro.png"/></a>
                <div className="collapse navbar-collapse" id="menuprincipal">
                    <ul className="navbar-nav ml-auto mt-2 mt-md-0">
                        <li className="nav-item active"><a href="" className="nav-link">Home</a></li>
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle" href="http://example.com" id="gameDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Game <span className="caret"></span>
                            </a>
                            <div className="dropdown-menu" aria-labelledby="gameDropdownMenuLink">
                                <a className="dropdown-item" href="#" onClick={this.props.newGame}>New Game</a>
                                <a className="dropdown-item" href="#" onClick={this.salvarPartida}>Json File</a>
                                <a className="dropdown-item" href="#" onClick={this.mensaje}>Message Room</a>
                                <a className="dropdown-item" href="#" onClick={this.pruebaPartida}>Prueba</a>
                            </div>
                        </li>

                        <CuentasWrapper cambiarPassword={this.props.cambiarPassword} login={this.props.login} crearCuenta={this.props.crearCuenta} />
                    </ul>
                </div>
            </nav>
        )
    }
}
