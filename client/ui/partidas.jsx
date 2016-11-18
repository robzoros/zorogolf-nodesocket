import { connect } from 'react-redux'
import React, { Component } from 'react'
import ListaPartidas from './lista_partidas.jsx'
import ListaJugadores from './lista_jugadores.jsx'
import CrearPartida from './crear_partida.jsx'
import { nuevaPartida, nuevoJugador, addCampo, userLogin } from '../api/redux/acciones-partidas'
import {LISTA_PARTIDAS} from '../api/constantes'
import {inicio} from '../api/sesion'

class PartidasUI extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
        this.partida = this.partida.bind(this)
        this.nuevaPartida = this.nuevaPartida.bind(this)
        this.nuevoJugador = this.nuevoJugador.bind(this)
        this.addCampo = this.addCampo.bind(this)
    }

    componentWillMount() {
        inicio()
    }

    partida() {
        //return Partidas.find(this.props.datos.id).fetch()[0]
    }

    nuevaPartida(partida){
        this.props.dispatch(nuevaPartida(partida))
    }

    nuevoJugador(jugador){
        this.props.dispatch(nuevoJugador(jugador))
    }
    addCampo(campo){
        this.props.dispatch(addCampo(campo))
    }

    render() {
        let part = !this.props.datos.empezar ? this.partida() : {}
        const crearPartida = this.props.usuario.logado ? <CrearPartida/> : <h1>Sign in to start</h1>
        const mostrar = !this.props.datos.empezar ? <ListaJugadores id={part._id} jugadores={part.jugadores} campo={part.campo} nombre={part.nombre} funcionJ={nuevoJugador} funcionC={addCampo}/> : crearPartida

        let lista = []
        if (this.props.usuario.logado) {
            lista.push(<ListaPartidas key="SE" lista={LISTA_PARTIDAS.SIN_EMPEZAR} usuario={this.props.usuario} funcionJ={nuevoJugador} funcionP={nuevaPartida} />)
            lista.push(<ListaPartidas key="PR" lista={LISTA_PARTIDAS.PROPIAS} usuario={this.props.usuario} />)
        }

        return (
            <div className="container enlinea">
              {mostrar}
              {lista}
            </div>
        )
    }
}

function mapStateToProps(state) {
  return {
    usuario: state.usuario,
    datos: state.datos
  }
}

export default connect(mapStateToProps)(PartidasUI)