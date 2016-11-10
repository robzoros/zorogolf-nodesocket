
import { connect } from 'react-redux';
import React, {Component} from 'react';
import { Link, browserHistory } from 'react-router';
import CuentasWrapper from './form_cuenta.jsx'
import { empezarPartida } from '../api/actions/acciones-partidas';
import Store from '../api/store/store'

export default class Principal extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    return (
      <div className="container enlinea">
        <BarraNav />
        {this.props.children}
      </div>
    )
  }
}

class BarraNav extends Component {
  constructor(props) {
    super(props);
    this.newGame = this.newGame.bind(this)
  }

  newGame(){
    Store.dispatch(empezarPartida({}))
    browserHistory.push('/partidas')
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
            <a onClick={this.newGame}><img alt="Zorogolf" className="imagenLogo" src="../img/LogoletraClaro.png"/></a>
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
                      <li><a onClick={this.newGame}>New Game</a></li>
                  </ul>
              </li>
            </ul>
            <CuentasWrapper />
          </div>
        </div>
      </nav>
    )
  }
}
