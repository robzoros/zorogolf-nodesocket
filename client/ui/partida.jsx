import { connect } from 'react-redux';
import React, { Component } from 'react';
import JugadorActivo from './jugador_activo.jsx'
import Recorrido from './recorrido.jsx'
import Jugadores from './jugadores.jsx'
//import Partidas from '../api/colecciones'
import { nuevaPartida, addCampo, setEstadoHoyo, userLogin, actualizarJugadores } from '../api/redux/acciones-partidas';
import * as Control from '../api/controlador'
import { getIndiceJugador, getItem, contarEstados } from '../api/utiles'
import { ESTADO_JUGADOR, ESTADO_PARTIDA } from '../api/constantes'
import { datosCampo, renderRecorrido } from '../api/crear_campo.jsx'
import ReduxStateJugDB from '../api/reduxStateJugDB.jsx'

class Partida extends Component {
  constructor(props) {
    super(props);

    this.state = {
        subscription: {partidas: Meteor.subscribe('partidas')},
        cargando: true
    }
    this.fichaVisible = this.fichaVisible.bind(this)
    this.iniciarGolpe = this.iniciarGolpe.bind(this)
    this.elegirAccion = this.elegirAccion.bind(this)
    this.direccion = this.direccion.bind(this)
    this.partida = this.partida.bind(this)
    this.resolverAccion = this.resolverAccion.bind(this)
    this.boteGreen = this.boteGreen.bind(this)
  }

  componentWillUnmount() {
    this.state.subscription.partidas.stop()
  }

  componentWillMount() {
    if (!this.props.usuario.logado && Meteor.user()){
      let usuario = {}
      usuario.username = Meteor.user().username
      usuario.logado = true
      this.props.dispatch(userLogin(usuario))
    }
    Meteor.call('obtenerPartida', this.props.params.id, (error, result) => {
      let indice = getIndiceJugador(result.jugadores,  Meteor.user().username)

      result.id = result._id
      this.props.dispatch(nuevaPartida(result))
      this.props.dispatch(addCampo(result.hoyos))
      let hoyoActual = result.hoyo_actual ? result.hoyo_actual : { hoyo: 1, estado: ['G', 'G', 'G', 'G'] }
      this.props.dispatch(setEstadoHoyo(hoyoActual))

      let filas = renderRecorrido(result.hoyos[hoyoActual.hoyo-1].recorrido)
      let ancho = Math.ceil(datosCampo.campo_ancho / 10) * 10
      let largo = Math.ceil(datosCampo.campo_largo / 10) * 10
      largo+=25

      let fichas = result.jugadores.map(jugador => {
        let ficha = {}
        if (jugador.bola)
          ficha = { cx: jugador.bola.cx, cy: jugador.bola.cy, fila: jugador.bola.fila, columna:jugador.bola.columna }
        else
          ficha = { cx: datosCampo.tee_cx, cy: datosCampo.tee_cy, fila: datosCampo.tee_fila, columna: datosCampo.tee_columna }
        ficha.color = jugador.color
        return ficha
      })
      let ficha = fichas[indice]

      let svg = {
        ficha,
        ancho,
        largo,
        filas
      }

      let direccion = result.jugadores[indice].status.golpe ? result.jugadores[indice].status.golpe.direccion : null
      this.setState({cargando: false, svg, fichas, direccion})

    })

  }

  partida() {
    let partida = Partidas.find(this.props.params.id).fetch()[0];
    return partida
  }

  direccion(hexId) {
    this.setState({direccion: hexId})
  }

  fichaVisible(nombre) {
    if (this.state.fichas)
      this.setState({  svg: { ...this.state.svg, ficha: this.state.fichas[getIndiceJugador(this.props.datos.jugadores, nombre)]}})
  }

  iniciarGolpe(cartaPalo, cartaAccion, chip){
    if (this.state.direccion) {
      let hoyoActual = this.props.hoyo_actual
      let jugadores = this.props.datos.jugadores
      let indice = getIndiceJugador(jugadores, this.props.usuario.username)
      let jugador = jugadores[indice]
      let status = {}
      status.golpe = {
        cartaPalo: getItem(jugador.palos, 'fichero', cartaPalo),
        cartaAccion: getItem(jugador.mazo_accion.cartas, 'fichero', cartaAccion),
        direccion: this.state.direccion,
        chip
      }
      status.bola = this.state.svg.ficha
      status.estado = ESTADO_JUGADOR.ESPERANDO
      hoyoActual.estado[indice] = ESTADO_PARTIDA.ESPERANDO
      jugadores[indice].status.golpe = status.golpe
      jugadores[indice].status.bola = status.bola
      jugadores[indice].status.estado = status.estado
      if ( contarEstados(hoyoActual.estado, [ESTADO_PARTIDA.ESPERANDO, ESTADO_PARTIDA.FIN_HOYO, ESTADO_PARTIDA.GREEN]) === 4 ){
        Control.resolverEleccionGolpe(jugadores, hoyoActual, this.props.params.id)
      }
      else
        Meteor.call('actualizarEstadoJugador', hoyoActual, jugador, jugadores[indice].status, this.props.params.id)
    }
  }

  elegirAccion(iAccion, iDado){
    let jugadores = this.props.datos.jugadores
    let hoyoActual = this.props.hoyo_actual
    let indice = getIndiceJugador(jugadores, this.props.usuario.username)

    Control.resolverAccion(jugadores, hoyoActual, this.props.eventos, indice, iAccion, iDado, this.props.params.id)
  }

  resolverAccion(indiceDados, indiceDadoContrario){
    let jugadores = this.props.datos.jugadores
    let hoyoActual = this.props.hoyo_actual
    let jugador = getIndiceJugador(jugadores, this.props.usuario.username)
    switch (hoyoActual.accion_dado) {
      case 0:
        if (indiceDadoContrario && indiceDados >= 0){
          let nameOponente = indiceDadoContrario.substring(0, indiceDadoContrario.length -1)
          let iDadoOponente = parseInt(indiceDadoContrario.slice(-1))
          let oponente = getIndiceJugador(jugadores, nameOponente)
          Control.comprarDado(jugadores, jugador, oponente, indiceDados, iDadoOponente, hoyoActual, this.props.eventos, this.props.params.id)
        }
        break
      case 1:
        if (indiceDados.length){
          Control.voltearDados(jugadores, jugador, indiceDados, hoyoActual, this.props.eventos, this.props.params.id)
        }
        break
      case 2:
        if (indiceDados.length){
          Control.rerolDado(jugadores, jugador, indiceDados, hoyoActual, this.props.eventos, this.props.params.id)
        }
        break
      case 3:
        if (indiceDados >= 0){
          Control.sumar1Dado(jugadores, jugador, indiceDados, hoyoActual, this.props.eventos, this.props.params.id)
        }
        break
      default:
        break
    }
  }

  boteGreen(bote){
    let indice = getIndiceJugador(this.props.datos.jugadores, this.props.usuario.username)
    let jugador = this.props.datos.jugadores[indice]
    let hoyo = this.props.hoyos[this.props.hoyo_actual.hoyo-1]
    Control.resolverBoteGreen(jugador, bote, indice, this.props.hoyo_actual, hoyo, this.props.params.id)
  }

  render() {
    let contenido=[]
    let estadoActual
    if (this.props.usuario.logado && this.props.datos.jugadores && this.props.hoyo_actual) {
      estadoActual = <h1>{this.props.hoyo_actual.estado.join('-')}</h1>
      let indice = getIndiceJugador(this.props.datos.jugadores, this.props.usuario.username)
      let jugador = this.props.datos.jugadores[indice]
      let svg = this.state.svg
      let partida = this.partida()

      if (jugador.bola && svg) svg.ficha ={...jugador.bola, color: jugador.color}
      let recorrido = this.state.cargando ? <div className="col-lg-4" key="2">Loading...</div> : <Recorrido key="2" svg={svg} estado={jugador.status.estado} direccion={this.direccion} hexagono={this.state.direccion} boteGreen={this.boteGreen}/>
      contenido.push(<JugadorActivo key="1" fichaVisible={this.fichaVisible} iniciarGolpe={this.iniciarGolpe} direccion={this.direccion} elegirAccion={this.elegirAccion} resolverAccion={this.resolverAccion}/>)
      contenido.push(recorrido)
      contenido.push(<Jugadores key="3" fichaVisible={this.fichaVisible} />)

      contenido.push(<ReduxStateJugDB key="4" partida={partida} />)
    }
    else {
      contenido.push(<div key="1">Loading...</div>)
    }
    return (
      <div className="container enlinea">
        {estadoActual}
        {contenido}
      </div>
    )

  }
}

function mapStateToProps(state) {
  return {
    usuario: state.usuario,
    datos: state.datos,
    hoyos: state.hoyos,
    hoyo_actual: state.hoyo_actual,
    eventos: state.eventos
  }
}

export default connect(mapStateToProps)(Partida);
