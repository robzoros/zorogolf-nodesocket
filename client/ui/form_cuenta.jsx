import React, { Component } from 'react'
import { connect } from 'react-redux'
import { userLogout } from '../api/redux/acciones-partidas'

class CuentasWrapper extends Component {
    constructor(props) {
        super(props)
        this.state = {
            crearCuenta: false
        }

        this.crearCuentaTrue = this.crearCuentaTrue.bind(this)
        this.crearCuentaFalse = this.crearCuentaFalse.bind(this)
        this.handleClick = this.handleClick.bind(this)
    }

    crearCuentaTrue() {
        this.setState({crearCuenta: true})
        console.log(this.state)
    }
    crearCuentaFalse() {
        this.setState({crearCuenta: false})
        console.log(this.state)
    }

    handleClick(event){
        console.log(event)
        event.preventDefault()
        event.stopPropagation()
    }

    render() {
        let formulario
        let userLogged = (
        <ul className="nav navbar-nav navbar-right">
            <li id="login-dropdown-list" className="dropdown">
              <a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
                  {this.props.usuario.name}
                  <b className="caret"></b>
              </a>
              <div className="dropdown-menu">
                <button className="btn btn-default btn-block" id="login-buttons-open-change-password" onClick={this.props.cambiarPassword}>Change password</button>
                <button className="btn btn-block btn-primary" id="login-buttons-logout" onClick={this.props.logout}>Sign out</button>
              </div>
            </li>
        </ul>
        )

        let login = (
          <ul className="nav navbar-nav navbar-right" >
            <li id="login-dropdown-list" className="dropdown">
              <a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Sign in / Join <b className="caret"></b></a>
              <div className="dropdown-menu"  onClick={this.handleClick}>
                <input id="login-username" type="text" placeholder="Username" className="form-control" />
                <input id="login-password" type="password" placeholder="Password" className="form-control" onClick={this.handleClick}/>
                <button className="btn btn-primary col-xs-12 col-sm-12" id="login-buttons-password" type="button" onClick={this.props.login}>Sign in</button>
                <div id="login-other-options">
                  <a id="signup-link" className="pull-right" onClick={this.crearCuentaTrue}>Create account</a>
                </div>
              </div>
            </li>
         </ul>
        )

        let crearCuenta = (
            <ul className="nav navbar-nav navbar-right">
                <li id="login-dropdown-list" className="dropdown active open">
                    <a className="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">Sign in / Join <b className="caret"></b></a>
                    <div className="dropdown-menu">
                        <input id="login-username" type="text" placeholder="Username" className="form-control"/>
                        <input id="login-password" type="password" placeholder="Password" className="form-control"/>
                        <input id="login-password-again" type="password" placeholder="Password (again)" className="form-control"/>
                        <input id="login-email" type="email" placeholder="Email" className="form-control"/>
                        <button className="btn btn-primary col-xs-12 col-sm-12" id="login-buttons-password" type="button" onClick={this.props.crearCuenta}>Create</button>
                        <button id="back-to-login-link" className="btn btn-default col-xs-12 col-sm-12" onClick={this.crearCuentaFalse}>Cancel</button>
                    </div>
                </li>
            </ul>
        )
        formulario = this.props.usuario.logado ? userLogged : (this.state.crearCuenta ? crearCuenta : login )

        return formulario
    }
}

function mapStateToProps(state) {
  return {
    usuario: state.usuario
  }
}

const mapDispatchToProps = (dispatch) => {
    return {
        logout: () => {
            console.log("logout")
            dispatch(userLogout({}))
        }
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CuentasWrapper);