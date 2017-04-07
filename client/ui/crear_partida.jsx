import { connect } from 'react-redux';
import React, {Component} from 'react';
import { emitirMensaje } from '../api/socket'
import SelectColor from './color.jsx';
import { nuevaPartida, nuevoJugador } from '../api/redux/acciones-partidas';
import { COLORES } from '../api/constantes'
import MENSAJES_SOCKET from '../../shared/socket_const'

class CrearPartida extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id:0,
      color: "Black"
    }

    this.setColor = this.setColor.bind(this)
    this.crearPartida = this.crearPartida.bind(this)

  };

  setColor(color) {
    this.setState({color: color})
  }

  crearPartida(e) {
    e.preventDefault()
    var partida = {}
    var jugador = {}
    var jugadores = []
    partida.nombre = document.getElementById('nombre').value
    partida.jugadores = jugadores
    partida.campo = 'Zorocampo'
    jugador.nombre = this.props.usuario.name
    jugador.color = this.state.color
    emitirMensaje(MENSAJES_SOCKET.NUEVA_PARTIDA, {partida, jugador} )
    
    /* Meteor.call('nuevaPartida', partida, (error, result) => {
      this.setState({id: result})
      partida.id = result

      Meteor.call('addJugador', jugador, partida.id, (err, jug) => {
        this.props.dispatch(nuevaPartida(partida))
        this.props.dispatch(nuevoJugador(jug))
      })
    })*/
  }

  render() {
    return <section className="container bg-primary panel-partida rounded-top">
      <form name="juegoForm" className="col-xs-12 col-lg-8" role="form" onSubmit={this.crearPartida} >
        <h1 className="panel-partida-label">New Game Data</h1>
        <div className="row-fluid form-group" >
          <div className="col-xs-4 col-lg-4">
              <label className="control-label panel-partida-label">Game Name</label>
          </div>
          <div className="col-xs-8 col-lg-8">
            <input id="nombre"
                className="form-control"
                type="text"
                name="nombre"
                placeholder="Name"
                required />
          </div>
        </div>

        <div className="row-fluid form-group" >
          <div className="col-xs-4 col-lg-4">
            <label className="control-label panel-partida-label">Choose Color</label>
          </div>
          <div className="col-xs-4 col-lg-4">
            <SelectColor setColor={this.setColor} colores={COLORES}/>
          </div>
        </div>
        <div className="row-fluid form-group" >
          <div className="col-xs-4 col-xs-offset-4 col-lg-4 col-lg-offset-4">
            <button className="btn btn-success" type="submit">New Game</button>
          </div>
        </div>
      </form>
    </section>
  }
}

function mapStateToProps(state) {
  return {
    partidas: state.partida,
    usuario: state.usuario
  }
}

export default connect(mapStateToProps)(CrearPartida);
