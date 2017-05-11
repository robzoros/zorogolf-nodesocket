/* global $*/
import { connect } from 'react-redux';
import React, { Component } from 'react';
import JugadorActivo from './jugador_activo.jsx'
import Recorrido from './recorrido.jsx'
import Jugadores from './jugadores.jsx'
import { inicio } from '../api/sesion'
import { emitirMensaje } from '../api/socket'
import CONSTANTES from '../../shared/server_const'
import Utiles from '../../shared/utiles'
import * as Control from '../api/controlador'
import { getIndiceJugador, getItem } from '../api/utiles'
import { datosCampo, renderRecorrido, centroHexagono } from '../api/crear_campo.jsx'
//import { nuevaPartida, addCampo, setEstadoHoyo, userLogin, actualizarJugadores } from '../api/redux/acciones-partidas';
//import ReduxStateJugDB from '../api/reduxStateJugDB.jsx'

class Partida extends Component {
  constructor(props) {
    super(props);

    this.state = {
        cargando: true
    }
    this.iniciarHoyo = this.iniciarHoyo.bind(this)
    this.fichaVisible = this.fichaVisible.bind(this)
    this.iniciarGolpe = this.iniciarGolpe.bind(this)
    this.elegirAccion = this.elegirAccion.bind(this)
    this.accionPrevia = this.accionPrevia.bind(this)
    this.direccion = this.direccion.bind(this)
    this.resolverAccionDado = this.resolverAccionDado.bind(this)
    this.boteGreen = this.boteGreen.bind(this)
  }


  componentWillMount() {
    inicio()
    emitirMensaje(CONSTANTES.CARGAR_PARTIDA, this.props.params.id)
    if (this.props.datos.jugadores) this.iniciarHoyo(this.props)
  }
  
  componentWillReceiveProps(nextProps) {
    if (!this.props.datos.jugadores && nextProps.datos.jugadores ) this.iniciarHoyo(nextProps)
  }
  
  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip()
  }
  
  iniciarHoyo(props) {
    let indice = getIndiceJugador(props.datos.jugadores, props.usuario.name )

    let filas = renderRecorrido(props.hoyos[props.hoyo_actual.hoyo-1].recorrido)
    let ancho = Math.ceil(datosCampo.campo_ancho / 10) * 10
    let largo = Math.ceil(datosCampo.campo_largo / 10) * 10
    largo+=25
  
    let fichas = props.datos.jugadores.map(jugador => {
      let ficha = {}
      if (jugador.bola)
        ficha = centroHexagono( {fila: jugador.bola.fila, columna:jugador.bola.columna })
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
  
    let direccion = props.datos.jugadores[indice].status.golpe ? props.datos.jugadores[indice].status.golpe.direccion : null
    this.setState({cargando: false, svg, fichas, direccion, indice})
  
  }

  direccion(hexId) {
    this.setState({direccion: hexId})
  }

  fichaVisible(nombre) {
    if (this.state.fichas){
      let indice = getIndiceJugador(this.props.datos.jugadores, nombre)
      let bolaJugador = this.state.fichas[indice]
      let ficha = centroHexagono(bolaJugador)
      ficha.color = bolaJugador.color
      this.setState({ svg: { ...this.state.svg, ficha }, indice })
    }
  }

  iniciarGolpe(cartaPalo, cartaAccion, chip){
    if (this.state.direccion) {
      let hoyoActual = this.props.hoyo_actual
      let jugadores = this.props.datos.jugadores
      let indice = getIndiceJugador(jugadores, this.props.usuario.name)
      let status = {}
      status.golpe = {
        cartaPalo: getItem(jugadores[indice].palos, 'fichero', cartaPalo),
        cartaAccion: getItem(jugadores[indice].mazo_accion.cartas, 'fichero', cartaAccion),
        direccion: this.state.direccion,
        chip
      }
      status.bola = this.state.svg.ficha
      status.estado = CONSTANTES.ESTADO_JUGADOR.ESPERANDO
      hoyoActual.estado[indice] = CONSTANTES.ESTADO_PARTIDA.ESPERANDO
      
      jugadores[indice].status.golpe = status.golpe
      jugadores[indice].status.bola = status.bola
      jugadores[indice].status.estado = status.estado

      let datosMensaje = {
        jugador_indice: indice,
        jugador: jugadores[indice],
        status_hoyo: CONSTANTES.ESTADO_PARTIDA.ESPERANDO,
        id: this.props.params.id
      }
      emitirMensaje(CONSTANTES.ACTUALIZAR_JUGADOR, datosMensaje)
    }
    else {
      console.log("You must select a direction on the hole map")
    }
  }

  elegirAccion(iAccion, iDado){
    let jugadores = this.props.datos.jugadores
    let hoyoActual = this.props.hoyo_actual
    let indice = getIndiceJugador(jugadores, this.props.usuario.name)

    Control.elegirAccion(jugadores, hoyoActual, indice, iAccion, iDado)
    if (hoyoActual.accion_dado === -1 ) this.resolverAccionDado()
  }

  accionPrevia(jugador) {
    console.log(jugador)
    let indice = getIndiceJugador(this.props.datos.jugadores, jugador.nombre)
    jugador.status.estado = CONSTANTES.ESTADO_JUGADOR.TURNO
    let datosMensaje = {
      jugador_indice: indice,
      jugador,
      status_hoyo: CONSTANTES.ESTADO_PARTIDA.TURNO,
      id: this.props.params.id
    }
    emitirMensaje(CONSTANTES.ACCION_PREVIA, datosMensaje)
  }

  // ****************************************************************************
  // Resolver la acción disparada por la elección de una acción y un dado
  // ****************************************************************************
  resolverAccionDado(indiceDados, indiceDadoContrario){
    let jugadores = this.props.datos.jugadores
    let hoyoActual = this.props.hoyo_actual
    let indice = getIndiceJugador(jugadores, this.props.usuario.name)
    let jugador = jugadores[indice]

    switch (hoyoActual.accion_dado) {
      case 0:
        if (indiceDadoContrario && indiceDados >= 0){
          let nameOponente = indiceDadoContrario.substring(0, indiceDadoContrario.length -1)
          let iDadoOponente = parseInt(indiceDadoContrario.slice(-1))
          let oponente = jugadores[getIndiceJugador(jugadores, nameOponente)]
          Control.comprarDado(jugador, oponente, indiceDados, iDadoOponente)
        }
        break
      case 1:
        if (indiceDados.length){
          Control.voltearDados(jugador, indiceDados)
        }
        break
      case 2:
        if (indiceDados.length){
          Control.rerolDado(jugador, indiceDados)
        }
        break
      case 3:
        if (indiceDados >= 0){
          Control.sumar1Dado(jugador, indiceDados)
        }
        break
      default:
        break
    }
    
    // Actualizamos estado del jugador y general
    hoyoActual.estado[indice] = jugadores[indice].status.dados.length ? CONSTANTES.ESTADO_PARTIDA.TURNO : CONSTANTES.ESTADO_PARTIDA.FIN_ACCIONES
    jugadores[indice].status.estado = jugadores[indice].status.dados.length ? CONSTANTES.ESTADO_JUGADOR.TURNO : CONSTANTES.ESTADO_JUGADOR.FIN_ACCIONES
    hoyoActual.accion_dado = -1
    
    console.log("Hoyo actual: ", hoyoActual)
    //Obtenemos siguiente jugador y actualizamos estado
    let siguiente = Control.siguienteJugador(hoyoActual, indice)
    console.log("NEXT: ", siguiente)
  	if (siguiente !== indice || (siguiente === indice && Utiles.contarEstados(hoyoActual.estado, [CONSTANTES.ESTADO_PARTIDA.FIN_ACCIONES]) === 3)) {
  		hoyoActual.estado[siguiente] = CONSTANTES.ESTADO_PARTIDA.ACCION
  		jugadores[siguiente].status.estado = CONSTANTES.ESTADO_JUGADOR.ACCION
      console.log("HOYOActual: ", hoyoActual)
	  }

    let data = {}
	  data.id = this.props.params.id
	  data.jugadores = jugadores
	  data.hoyo_actual = hoyoActual
	  
    // Actualizamos BBDD y mandamos información a resto de jugadores
    console.log(CONSTANTES.ACCION_JUGADOR,  data.jugadores.map((j) => {return j.status.dados.map((d) => d.valor)}))
    emitirMensaje(CONSTANTES.ACCION_JUGADOR, data)
  }

  boteGreen(bote){
    let indice = getIndiceJugador(this.props.datos.jugadores, this.props.usuario.name)
    let jugador = this.props.datos.jugadores[indice]
    let hoyo = this.props.hoyos[this.props.hoyo_actual.hoyo-1]
    Control.resolverBoteGreen(jugador, bote, indice, this.props.hoyo_actual, hoyo, this.props.params.id)
  }

  render() {
    let contenido=[]
    let estadoActual
    if (this.props.usuario.logado && this.props.datos.jugadores && this.props.hoyo_actual) {
      estadoActual = <h1>{this.props.hoyo_actual.estado.join('-')}</h1>
      let indice = getIndiceJugador(this.props.datos.jugadores, this.props.usuario.name)
      let jugador = this.props.datos.jugadores[indice]
      let svg = this.state.svg

      svg.ficha = centroHexagono(this.props.datos.jugadores[this.state.indice].bola)
      svg.ficha.color = this.props.datos.jugadores[this.state.indice].color

      let recorrido = this.state.cargando ? <div className="col-lg-4" key="2">Loading...</div> : <Recorrido key="2" svg={svg} estado={jugador.status.estado} direccion={this.direccion} hexagono={this.state.direccion} boteGreen={this.boteGreen}/>
      contenido.push(<JugadorActivo key="1" fichaVisible={this.fichaVisible} iniciarGolpe={this.iniciarGolpe} direccion={this.direccion} elegirAccion={this.elegirAccion} resolverAccion={this.resolverAccionDado} accionPrevia={this.accionPrevia}/>)
      contenido.push(recorrido)
      contenido.push(<Jugadores key="3" fichaVisible={this.fichaVisible} />)

    }
    else {
      contenido.push(<div key="1">Loading...</div>)
    }
    return (
      <div className="container-fluid partida">
        <div className="row">
          {contenido}
        </div>
        {estadoActual}
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
