import { connect } from 'react-redux';
import React, {Component} from 'react';
import {estiloJugador} from '../api/utiles'
import Dado from './dado.jsx'

class Jugadores extends Component {
  constructor(props) {
    super(props);
    this.state = {
      subscription: {partidas: Meteor.subscribe('Partidas')}
    }

    this.panelClicked = this.panelClicked.bind(this)
  };

  componentWillUnmount() {
    this.state.subscription.partidas.stop();
  }

  panelClicked(evt) {
    let panel = evt.target
    this.props.fichaVisible(panel.id)
  }

  render() {
    return (
      <div className="col-lg-4 margen-top20" data-toggle="buttons">
        {this.props.datos.jugadores.map((jugador) => {
          let estilo = estiloJugador(jugador.color)
          let dados = jugador.status.dados ? (
            <div className="col-lg-12">
              <div className="margen-top20" id={jugador.nombre + "dados"} >
                {jugador.status.dados.map((dado, indice) => {
                  let enabled = (this.props.hoyo_actual.accion_dado === 0) && (dado.color === jugador.color)
                  return  <label key={indice} className={"btn btn-primary btn-margen" + (enabled ? "" : " disabled")}>
                            <input type="radio" autocomplete="off" value={jugador.nombre + indice} />
                            <Dado dado={dado} />
                          </label> })}
              </div>
            </div> ) : null
          if (jugador.nombre !== this.props.usuario.username)
            return <div key={jugador.nombre} className="panel panel-default">
                  <div className="panel-heading" id={jugador.nombre} onClick={this.panelClicked} style={estilo}>{jugador.nombre}</div>
                  <div className="panel-body">
                    <h4 className="tituloJugador">State: <span className="pull-right">{jugador.status.estado}</span></h4>
                    <h3 className="tituloJugador">Points: <span className="pull-right">{jugador.golpes}</span></h3>
                    <h3 className="tituloJugador">Progress: <span className="pull-right">{jugador.progreso}</span></h3>
                    {dados}
                  </div>
                 </div>
        })}
      </div>
    )

  }
}

function mapStateToProps(state) {
  return {
    usuario: state.usuario,
    datos: state.datos,
    hoyo_actual: state.hoyo_actual
  }
}

export default connect(mapStateToProps)(Jugadores);
