import { connect } from 'react-redux'
import React, {Component} from 'react'
import { browserHistory } from 'react-router'

import SelectColor from './color.jsx'
import {nuevaPartida,nuevoJugador} from '../api/redux/acciones-partidas'
import {COLORES, LISTA_PARTIDAS} from '../api/constantes'

class ItemPartida extends Component{
  constructor(props) {
    super(props)
    this.state = {
      color: "Red",
      display: "none",
      listaColores: COLORES.concat()
    }

    this.setColor = this.setColor.bind(this)
    this.unirse = this.unirse.bind(this)
    this.mostrar = this.mostrar.bind(this)
    this.cambiarPartida = this.cambiarPartida.bind(this)
    this.actualizarListaColores = this.actualizarListaColores.bind(this)
  }

  actualizarListaColores(jugadores) {
    let lista = this.state.listaColores.concat()
    for (let i=0;i<jugadores.length;i++) {
      let index = lista.indexOf(jugadores[i].color)
      if (index > -1) lista.splice(index, 1)
    }
    this.setState({listaColores: lista})
    this.setState({color: lista[0]})
  }

  componentWillMount() {
    this.actualizarListaColores(this.props.partida.jugadores)
  }

  componentWillReceiveProps(nextProps){
    this.actualizarListaColores(nextProps.partida.jugadores)
  }

  mostrar(){
    this.setState({ display: (this.state.display === 'none' ? 'inline' : 'none' ) })
  }

  setColor(color) {
    this.setState({color: color})
  }

  unirse(e){
    e.preventDefault()
    var jugador = {}
    jugador.nombre = Meteor.user().username
    jugador.color = this.state.color
    Meteor.call('addJugador', jugador, this.props.partida._id)
    let part = this.props.partida
    part.id = this.props.partida._id
    this.props.dispatch(nuevaPartida(part))
  }

  cambiarPartida(e){
    e.preventDefault()
    let part = this.props.partida
    part.id = this.props.partida._id
    this.props.dispatch(nuevaPartida(part))
    if (this.props.partida.jugadores.length === 4) {
      browserHistory.push('/Partida/' + this.props.partida._id)
    }
  }

  render() {
    let accion = []
    if( this.props.lista === LISTA_PARTIDAS.SIN_EMPEZAR) {
      accion.push( <div key={"1"} className="row-fluid form-group" >
                  <div className="col-xs-4 col-lg-3 text-right">
                    <label for="color" className="control-label">Choose Color</label>
                  </div>
                  <div className="col-xs-4 col-lg-4">
                    <SelectColor setColor={this.setColor} colores={this.state.listaColores} indice={this.props.indice} />
                  </div>
                </div> )

      accion.push( <div key={"2"} className="row-fluid form-group" >
                  <div className="col-xs-4 col-xs-offset-4 col-lg-4 col-lg-offset-3 margen-top20">
                    <button className="btn btn-success" type="submit" onClick={this.unirse}>Join</button>
                  </div>
                </div>)
    }
    else {
      accion.push( <div key={"1"} className="row-fluid col-xs-8 col-md-10 col-sd-8 col-lg-10" >
                  <div className="col-xs-4 col-xs-offset-3 col-lg-4">
                    <button className="btn btn-success" type="submit" onClick={this.cambiarPartida}>Go</button>
                  </div>
                </div>)
    }

    return <div>
      <div className="col-xs-8 col-lg-6">
        <label className="control-label clickable" onClick={this.mostrar}>{this.props.partida.nombre}</label>
      </div>
      <div className="col-xs-4 col-lg-3">
        <label className="control-label">{this.props.partida.jugadores.length} players</label>
      </div>
      <div className="col-xs-12 col-lg-12 margen-top20" style={{display: this.state.display}}>
        <div className="panel panel-default wheat">
          <div className="panel-heading">{this.props.partida.nombre}</div>
          <div className="panel-body">
            <div className='row-fluid col-xs-8 col-md-10 col-sd-8 col-lg-10'>
              {this.props.partida.jugadores.map((jugador) => {
                return <div key={jugador.nombre}>
                  <div className="col-xs-10 col-lg-5 col-lg-offset-3">
                    <label for="color" className="control-label">{jugador.nombre} </label>
                  </div>
                  <div className="col-xs-1 col-lg-1">
                    <i className="fa fa-user fa-lg" style={{color: jugador.color}} aria-hidden="true"></i>
                  </div>
                </div>
              })}
            </div>
            {accion}
          </div>
        </div>
      </div>
    </div>

  }
}

function mapStateToProps(state) {
  return {
  }
}

export default connect(mapStateToProps)(ItemPartida)
