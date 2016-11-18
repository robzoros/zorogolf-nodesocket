import { connect } from 'react-redux';
import React, {Component} from 'react';
import SelectColor from './color.jsx';
import { nuevaPartida, nuevoJugador } from '../api/redux/acciones-partidas';
import {COLORES} from '../api/constantes'

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
    /* Meteor.call('nuevaPartida', partida, (error, result) => {
      this.setState({id: result})
      partida.id = result
      jugador.nombre = Meteor.user().username
      jugador.color = this.state.color
      Meteor.call('addJugador', jugador, partida.id, (err, jug) => {
        this.props.dispatch(nuevaPartida(partida))
        this.props.dispatch(nuevoJugador(jug))
      })
    })*/
  }

  render() {
    return <section className="bg-primary">
      <div className='container'>
        <form name="juegoForm" className="form-horizontal col-xs-12 col-lg-8" role="form" onSubmit={this.crearPartida} >
          <h1 className="text-center">New Game Data</h1>
          <div className="row-fluid form-group" >
            <div className="col-xs-4 col-lg-4 text-right">
                <label className="control-label">Game Name</label>
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
            <div className="col-xs-4 col-lg-4 text-right">
              <label className="control-label">Choose Color</label>
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
      </div>
    </section>
  }
}

function mapStateToProps(state) {
  return {
    partidas: state.partida
  }
}

export default connect(mapStateToProps)(CrearPartida);
