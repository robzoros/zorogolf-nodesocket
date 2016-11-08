import React, {Component} from 'react';
import {ESTADO_PARTIDA} from '../api/constantes'
import { actualizarJugadores, setEstadoHoyo } from '../api/actions/acciones-partidas';
import Store from '../api/store/store'

export default class ReduxStateJugDB extends Component {
  constructor(props) {
    super(props);
  };

  componentWillReceiveProps(nextProps){
    if (nextProps.partida && this.props.partida
      && (nextProps.partida.hoyo_actual.estado.join('') !== this.props.partida.hoyo_actual.estado.join(''))) {

      Store.dispatch(setEstadoHoyo(nextProps.partida.hoyo_actual))
      Store.dispatch(actualizarJugadores(nextProps.partida.jugadores))
    }
  }

  render() {
    return false
  }
}
