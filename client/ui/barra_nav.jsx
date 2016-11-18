import { connect } from 'react-redux'
import React, {Component} from 'react'
import { Link, browserHistory } from 'react-router'
import CuentasWrapper from './form_cuenta.jsx'
import { empezarPartida } from '../api/redux/acciones-partidas'
import Store from '../api/redux/store'
import {login} from  '../api/sesion'

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
            console.log("CrearCuenta")
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

class BarraNav extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      <nav className="navbar navbar-default navbar-fixed-top">
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
              <span className="icon-bar"></span>
            </button>
            <a onClick={this.props.newGame}><img alt="Zorogolf" className="imagenLogo" src="../img/LogoletraClaro.png"/></a>
          </div>

          <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
            <ul className="nav navbar-nav">
              <li className="dropdown">
                  <a className="dropdown-toggle"
                     data-toggle="dropdown"
                     role="button"
                     aria-haspopup="true"
                     aria-expanded="false" >Game <span className="caret"></span></a>
                  <ul className="dropdown-menu">
                      <li><a onClick={this.props.newGame}>New Game</a></li>
                  </ul>
              </li>
            </ul>

            <CuentasWrapper cambiarPassword={this.props.cambiarPassword} login={this.props.login} crearCuenta={this.props.crearCuenta} />
          </div>
        </div>
      </nav>
    )
  }
}
