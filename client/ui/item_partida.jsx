import { connect } from 'react-redux'
import React, {Component} from 'react'
import { browserHistory } from 'react-router'
import { emitirMensaje } from '../api/socket'

import SelectColor from './color.jsx'
import { nuevaPartida } from '../api/redux/acciones-partidas'
import { COLORES, LISTA_PARTIDAS } from '../api/constantes'
import MENSAJES_SOCKET from '../../shared/socket_const'


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
		jugador.nombre = this.props.usuario.name
		jugador.color = this.state.color
		//Meteor.call('addJugador', jugador, this.props.partida._id)
		//let part = this.props.partida
		//part.id = this.props.partida._id
		//this.props.dispatch(nuevaPartida(part))
		emitirMensaje(MENSAJES_SOCKET.NUEVO_JUGADOR, {id: this.props.partida._id, jugador})

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
			accion.push( <div key={"1"} className="row align-items-baseline" >
									<div className="col-7">
										<label id="color" className="control-label">Choose Color</label>
									</div>
									<div className="col-4">
										<SelectColor setColor={this.setColor} colores={this.state.listaColores} indice={this.props.indice} />
									</div>
								</div> )

			accion.push( <div key={"2"} className="row form-group" >
									<div className="col-11 text-right">
										<button className="btn btn-success" type="submit" onClick={this.unirse}>Join</button>
									</div>
								</div>)
		}
		else {
			accion.push( <div key={"1"} className="row" >
									<div className="col-11 text-right">
										<button className="btn btn-success" type="submit" onClick={this.cambiarPartida}>Go</button>
									</div>
								</div>)
		}

		return <div>
			<label className="control-label clickable item-clickable col-12" onClick={this.mostrar}>{this.props.partida.nombre}</label>
			<label className="control-label col-12">{this.props.partida.jugadores.length} players</label>
			<div className="col-12 margen-top20" style={{display: this.state.display}}>
				<div className="card wheat">
					<div className="card-header">{this.props.partida.nombre}</div>
					<div className="card-block">
						<div className='container'>
							{this.props.partida.jugadores.map((jugador) => {
								return <div className="row" key={jugador.nombre}>
									<div className="col-10">
										<label className="control-label">{jugador.nombre} </label>
									</div>
									<div className="col-1">
										<i className="fa fa-user fa-lg" style={{color: jugador.color}} aria-hidden="true"></i>
									</div>
								</div>
							})}
						{accion}
						</div>
					</div>
				</div>
			</div>
		</div>

	}
}

function mapStateToProps(state) {
	return {
		usuario: state.usuario
	}
}

export default connect(mapStateToProps)(ItemPartida)
