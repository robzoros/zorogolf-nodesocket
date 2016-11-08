import { connect } from 'react-redux';
import React, {Component} from 'react';
import {ESTADO_JUGADOR} from '../api/constantes'
import { renderGreen, greenBbox } from '../api/crear_campo.jsx'
import { getIndiceJugador } from '../api/utiles'
import Dado from './dado.jsx'

class GreenModal extends Component {
  constructor(props) {
    super(props)
    this.state = {
      direccion: null,
      fuerza: null,
      dadoClickado: false
    }
    this.setDireccion = this.setDireccion.bind(this)
    this.setFuerza = this.setFuerza.bind(this)
    this.reset = this.reset.bind(this)
    this.estadoBoton = this.estadoBoton.bind(this)
    this.proceder = this.proceder.bind(this)
  }

  setDireccion() {
    let label = $('#dadosGreen label.active')
    let indiceDado = $('#dadosGreen label.active input').val()
    let indice = getIndiceJugador(this.props.datos.jugadores,  Meteor.user().username)
    let jugador = this.props.datos.jugadores[indice]
    let direccion = jugador.status.dados_green[indiceDado].valor

    label.attr("disabled", true)
    label.attr("class", "btn btn-primary btn-margen")
    this.setState({direccion})
    this.estadoBoton()
  }

  setFuerza(){
    let indiceDado = $('#dadosGreen label.active input').val()
    let indice = getIndiceJugador(this.props.datos.jugadores,  Meteor.user().username)
    let jugador = this.props.datos.jugadores[indice]
    let fuerza = jugador.status.dados_green[indiceDado].valor

    $('#dadosGreen label.active').attr("disabled", true)
    this.setState({fuerza})
  }

  reset(){
    $('#dadosGreen label').each(function() {$( this ).attr("disabled",false)})
    this.setState({direccion: null, fuerza: null})
    this.estadoBoton()
  }

  estadoBoton() {
    console.log("Dados clickados: %i", $('#dadosGreen label.active').length)
    this.setState({dadoClickado: $('#dadosGreen label.active').length})
  }

  proceder(){
    let bote = {
      direccion: this.state.direccion,
      fuerza: this.state.fuerza
    }
    this.props.callback(bote)
  }

  render() {
    let indice = getIndiceJugador(this.props.datos.jugadores,  Meteor.user().username)
    let green = this.props.hoyos[this.props.hoyo_actual.hoyo - 1].green
    let jugador = this.props.datos.jugadores[indice]
    let estadoJugador = jugador.status.estado
    let dadosMostrar
    let botonesFinales
    let bolas

    if ( estadoJugador === ESTADO_JUGADOR.ENTRANDO_GREEN) {
      let botonDireccion = this.state.direccion ? null : (
        <Boton estado={this.state.dadoClickado} callback={this.setDireccion} texto={"Set Direction"}></Boton>
      )
      let botonFuerza = this.state.direccion && !this.state.fuerza ? (
        <Boton estado={this.state.dadoClickado} callback={this.setFuerza} texto={"Set Distance"}></Boton>
      ) : null

      dadosMostrar = (
        <div key='dadosG' className="bottom-align">
          <div className="col-lg-6 margen-top20" id={"dadosGreen"} data-toggle="buttons" >
            {jugador.status.dados_green.map((dado, indice) => {
              return  <label key={"dadoGreen" + indice} className="btn btn-primary btn-margen" onClick={this.estadoBoton}>
                        <input type="radio" autocomplete="off" value={indice}/>
                        <Dado dado={dado} />
                      </label> })}
          </div>
          <div className="col-lg-3 margen-top20">
            {botonDireccion}
            {botonFuerza}
          </div>
        </div>
      )

      let botonProceed = this.state.direccion && this.state.fuerza ? (
        <Boton estado={true} callback={this.proceder} texto={"Proceed"}></Boton>
      ) : null
      botonesFinales = this.state.direccion ? (
        <div className="col-lg-4 margen-top20">
          <Boton estado={true} callback={this.reset} texto={"Reset"}></Boton>
          <label style={{color: "white"}}>_</label>
          {botonProceed}
        </div>
      ) : null    }

    bolas = this.props.datos.jugadores.map(jugador => {
      let id = jugador.status.bola.fila + "x" + jugador.status.bola.columna
      let h = green.hexagonos.indexOf(id)
      let loseta = green.losetas[h]
      return {...jugador.status.bola, loseta}
    })
    let svg = renderGreen(green, bolas)
    return (
      <div className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">Green</h4>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                {svg}
                {dadosMostrar}
                {botonesFinales}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal" aria-label="Close">Close</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

class Boton extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return <button type="button" className="btn btn-secondary" disabled={!this.props.estado} onClick={this.props.callback}>{this.props.texto}</button>
  }
}

function mapStateToProps(state) {
  return {
    datos: state.datos,
    hoyo_actual: state.hoyo_actual,
    hoyos: state.hoyos
  }
}

export default connect(mapStateToProps)(GreenModal)
