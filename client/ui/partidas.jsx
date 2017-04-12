import { connect } from 'react-redux'
import React, { Component } from 'react'
import ListaPartidas from './lista_partidas.jsx'
import ListaJugadores from './lista_jugadores.jsx'
import CrearPartida from './crear_partida.jsx'
import {LISTA_PARTIDAS} from '../api/constantes'
import {inicio} from '../api/sesion'

class PartidasUI extends Component {
	constructor(props) {
		super(props)
		this.state = {
		}
	}

	componentWillMount() {
		inicio()
	}

	render() {
		let part = !this.props.datos.empezar ? this.props.datos : {}
		const crearPartida = this.props.usuario.logado ? <CrearPartida/> : <h1>Sign in to start</h1>
		const mostrar = !this.props.datos.empezar 
			? <ListaJugadores jugadores={part.jugadores} nombre={part.nombre} /> 
			: crearPartida

		let lista = []
		if (this.props.usuario.logado) {
			lista.push(<ListaPartidas key="SE" lista={LISTA_PARTIDAS.SIN_EMPEZAR} />)
			lista.push(<ListaPartidas key="PR" lista={LISTA_PARTIDAS.PROPIAS} />)
		}

		return (
			<div className="contenido">
				{mostrar}
				<section className="container w-100">
					<div className="row">
						{lista}
					</div>
				</section>
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
