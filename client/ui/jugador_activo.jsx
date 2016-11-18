import { connect } from 'react-redux';
import React, {Component} from 'react';
import { getIndiceJugador } from '../api/utiles'
import {PREFIJO_CARTAS, CARTAS_PALOS, ESTADO_JUGADOR} from '../api/constantes'
import CartasModal from './cartas_modal.jsx'
import Dado from './dado.jsx'

class JugadorActivo extends Component {
  constructor(props) {
    super(props);
    let jugador = getIndiceJugador(this.props.datos.jugadores, this.props.usuario.username)
    this.state = { jugador }

    this.mazoAccion = this.mazoAccion.bind(this)
    this.mazoPalos = this.mazoPalos.bind(this)
    this.panelClicked = this.panelClicked.bind(this)
    this.paloElegido = this.paloElegido.bind(this)
    this.cartaElegida = this.cartaElegida.bind(this)
    this.cartaDescarte = this.cartaDescarte.bind(this)
    this.iniciarGolpe = this.iniciarGolpe.bind(this)
    this.validarInicio = this.validarInicio.bind(this)
    this.elegirDado = this.elegirDado.bind(this)
    this.elegirAccionDados = this.elegirAccionDados.bind(this)
    this.actualizar = this.actualizar.bind(this)
    this.incDado = this.incDado.bind(this)
    this.decDado = this.decDado.bind(this)
    this.accionPrevia = this.accionPrevia.bind(this)
    this.deshabilitarBoton = this.deshabilitarBoton.bind(this)
  }

  componentWillMount(){
    let jugador = this.props.datos.jugadores[this.state.jugador]
    if (jugador.status.estado === ESTADO_JUGADOR.ESPERANDO) {this.props.direccion(jugador.status.golpe.direccion)}
    this.props.fichaVisible(this.props.usuario.username)
  }

  mazoAccion() {
    return this.props.datos.jugadores[this.state.jugador].mazo_accion.cartas.map((carta) => {
      return carta.fichero
    })
  }

  mazoDescartes() {
    return this.props.datos.jugadores[this.state.jugador].mazo_accion.descarte.map((carta) => {
      return carta.fichero
    })
  }

  mazoPalos() {
    return CARTAS_PALOS.FILES.map((carta) => {
      return CARTAS_PALOS.DIR + carta
    })
  }

  panelClicked(evt) {
    this.props.fichaVisible(this.props.usuario.username)
  }

  paloElegido(fichero){
    this.setState({cartaPalo: fichero})
  }

  cartaElegida(fichero){
    this.setState({cartaAccion: fichero})
  }

  cartaDescarte(fichero){
    this.setState({cartaDescarte: fichero})
  }

  iniciarGolpe(){
    let chip = $("#chip")[0].checked
    console.log("Checked: %o", chip)
    let jugador = this.props.datos.jugadores[this.state.jugador]
    let cartaAccion
    let cartaPalo
    if (jugador.status.estado === ESTADO_JUGADOR.GOLPE) {
      cartaAccion = this.state.cartaAccion ? this.state.cartaAccion : PREFIJO_CARTAS.CARTAS_BACK_ACCION + jugador.color + ".png"
      cartaPalo =  this.state.cartaPalo ? this.state.cartaPalo : PREFIJO_CARTAS.CARTAS_BACK_PALO + jugador.color + ".png"
    }
    else {
      cartaAccion = jugador.status.golpe.cartaAccion.fichero
      cartaPalo = jugador.status.golpe.cartaPalo.fichero
    }
    this.props.iniciarGolpe(cartaPalo, cartaAccion, chip)
  }

  validarInicio(){
    let jugador = this.props.datos.jugadores[this.state.jugador]
    let cartaAccion
    let cartaPalo
    if (jugador.status.estado === ESTADO_JUGADOR.GOLPE) {
      cartaAccion = this.state.cartaAccion ? this.state.cartaAccion : PREFIJO_CARTAS.CARTAS_BACK_ACCION + jugador.color + ".png"
      cartaPalo =  this.state.cartaPalo ? this.state.cartaPalo : PREFIJO_CARTAS.CARTAS_BACK_PALO + jugador.color + ".png"
    }
    else {
      cartaAccion = jugador.status.golpe.cartaAccion.fichero
      cartaPalo = jugador.status.golpe.cartaPalo.fichero
    }

    if ((cartaAccion.indexOf(PREFIJO_CARTAS.CARTAS_BACK_ACCION) < 0) && (cartaPalo.indexOf(PREFIJO_CARTAS.CARTAS_BACK_PALO) < 0)){
      return true
    }
    else {
      return false
    }
  }

  elegirDado(){
    let jugador = this.props.datos.jugadores[this.state.jugador]
    let idAccion = "#" + jugador.nombre + "accion"
    let idDados = "#" + jugador.nombre + "dados"
    let indiceAccion = $(idAccion + ' label.active input').val()
    let indiceDados = $(idDados + ' label.active input').val()
    if (indiceAccion && indiceDados) this.props.elegirAccion(indiceAccion, indiceDados)
  }

  deshabilitarBoton() {
    let jugador = this.props.datos.jugadores[this.state.jugador]
    let idDados = "#" + jugador.nombre + "dados"
    let indiceDados = $(idDados + ' label.active input').val()
    return this.state.dado || (! indiceDados)
  }

  incDado() {
    let jugador = this.props.datos.jugadores[this.state.jugador]
    let idDados = "#" + jugador.nombre + "dados"
    let indiceDados = $(idDados + ' label.active input').val()

    if (indiceDados) {
      if (jugador.status.dados[indiceDados].valor < 6) {
        jugador.status.dados[indiceDados].valor += 1
        document.getElementById("botonDecrementar").disabled = true
        document.getElementById("botonIncrementar").disabled = true
        this.setState({alerta: null})
      }
      else {
        this.setState({alerta: "Can't decrease over six"})
      }
    }
    else {
      this.setState({alerta: "Select one die"})
    }

  }

  decDado() {
    let jugador = this.props.datos.jugadores[this.state.jugador]
    let idDados = "#" + jugador.nombre + "dados"
    let indiceDados = $(idDados + ' label.active input').val()

    if (indiceDados) {
      if (jugador.status.dados[indiceDados].valor > 1) {
        jugador.status.dados[indiceDados].valor -= 1
        document.getElementById("botonDecrementar").disabled = true
        document.getElementById("botonIncrementar").disabled = true
        this.setState({alerta: null})
      }
      else {
        this.setState({alerta: "Can't decrease under one"})
      }
    }
    else {
      this.setState({alerta: "Select one die"})
    }
  }

  accionPrevia(){

  }

  elegirAccionDados(){
    let jugador = this.props.datos.jugadores[this.state.jugador]
    let idDados = "#" + jugador.nombre + "dados"
    let indiceDados
    switch (this.props.hoyo_actual.accion_dado) {
      case 0:
        let jugadores = this.props.datos.jugadores
        let indiceDadoContrario = jugadores.reduce((anterior, jug, indice) => {
          if (indice !== this.state.jugador)
            if (anterior)
              return anterior
            else
              return $('#' + jug.nombre + 'dados' + ' label.active input').val()
          else
            return anterior
        }, null)
        indiceDados = $(idDados + ' label.active input').val()
        console.log(indiceDadoContrario)
        break
      case 1:
        indiceDados = $(idDados + ' input:checked').map((a, b) => { return parseInt(b.value)})
        break
      case 2:
        indiceDados = $(idDados + ' input:checked').map((a, b) => { return parseInt(b.value)})
        break
      case 3:
        indiceDados = $(idDados + ' label.active input').val()
        break
      default:
        break
    }
    console.log(indiceDados)
    this.props.resolverAccion(indiceDados, indiceDadoContrario)
  }

  actualizar(a, b){
    if (a===1)
      this.setState({accion: b})
    else
      this.setState({dado: b})
  }

  render() {
    let jugador = this.props.datos.jugadores[this.state.jugador]
    let cartaAccion
    let cartaPalo
    if (jugador.status.estado === ESTADO_JUGADOR.GOLPE) {
      cartaAccion = this.state.cartaAccion ? this.state.cartaAccion : PREFIJO_CARTAS.CARTAS_BACK_ACCION + jugador.color + ".png"
      cartaPalo =  this.state.cartaPalo ? this.state.cartaPalo : PREFIJO_CARTAS.CARTAS_BACK_PALO + jugador.color + ".png"
    }
    else {
      cartaAccion = jugador.status.golpe.cartaAccion.fichero
      cartaPalo = jugador.status.golpe.cartaPalo.fichero
    }

    let accionDado = this.props.hoyo_actual.accion_dado
    let typeInputAccion = "radio"
    let botonElegirAccionDado
    let texto
    switch (accionDado) {
      case 0:
        texto = "Choose one Die from oponent and one of your dice"
        break
      case 1:
        texto = "Choose up to three dice to turn over"
        typeInputAccion = "checkbox"
        break
      case 2:
        texto = "Choose Dice to rerol"
        typeInputAccion = "checkbox"
        break
      case 3:
        texto = "Choose Die to add 1 point"
        break
      default:
        texto = ""
        break
    }
    botonElegirAccionDado = texto ? <button type="button" className="btn btn-secondary pull-right margen-top20" onClick={this.elegirAccionDados}>{texto}</button> : null

    let botonInicioGolpe = <button type="button" className="btn btn-default pull-right" onClick={this.iniciarGolpe}>Go</button>
    let elegirGolpe = (jugador.status.estado === ESTADO_JUGADOR.GOLPE) ? (
      [<div className="tituloJugador">Choose direction, club and action card{this.validarInicio() ? botonInicioGolpe : null}</div>,
      <div className="margen-top20">
        <label>
            <input id="chip" type="checkbox"/>
            <span>chip (divide by 2)</span>
        </label>
      </div>]
    ) : null


    let elegirAccion
    let dados
    let botonElegirAccion
    let acciones = jugador.status.acciones ? (
      <div className="col-lg-6" key='acciones'>
        <div className="margen-top20" id={jugador.nombre + "accion"} data-toggle="buttons">
          {jugador.status.acciones.map((accion, indice) => {
            let dado = accion.dado ? accion.dado : {color: 'ivory', valor: 0}
            return  <label key={"accion" + indice} className={"btn btn-primary btn-margen" + (accion.utilizado ? " disabled" : "")} onClick={this.actualizar.bind(this, 1, accion)}>
                      <input type="radio" autocomplete="off" value={indice} />
                      <Dado dado={dado} />
                    </label>
          })}
        </div>
      </div>
    ) : null
    if (jugador.status.estado === ESTADO_JUGADOR.ACCION
        || jugador.status.estado === ESTADO_JUGADOR.TURNO
        || jugador.status.estado === ESTADO_JUGADOR.ACCION_PREVIA ) {
      dados = (
        <div className="col-lg-6" key='dados'>
          <div className="margen-top20" data-toggle="buttons" id={jugador.nombre + "dados"}>
            {jugador.status.dados.map((dado, indice) => {
              return  <label key={"dados" + indice} className="btn btn-primary btn-margen" onClick={this.actualizar.bind(this, 2, dado)}>
                        <input type={typeInputAccion} autocomplete="off" value={indice} />
                        <Dado dado={dado} />
                      </label> })}
          </div>
        </div>
      )
      botonElegirAccion = <button key="botonElegirAccion" type="button" className="btn btn-secondary pull-right margen-top20" onClick={this.elegirDado}>Choose die</button>
    }

    let classBoton = "col-lg-2 btn btn-secondary btn-margen pull-right margen-top20"
    let botonIncrementar = <button id="botonIncrementar" key="botonIncrementar" type="button" className={classBoton} onClick={this.incDado}>+1 Die</button>
    let botonDecrementar = <button id="botonDecrementar" key="botonDecrementar" type="button" className={classBoton} onClick={this.decDado}>-1 Die</button>
    let botonCartaDescarte = <button key="botonElegirCarta" type="button" className={classBoton} data-toggle="modal" data-target="#modalDescarte">Choose card to recover</button>
    let botonAccionPrevia = <button key="botonAccionPrevia" type="button" className={classBoton} onClick={this.accionPrevia}>Proceed</button>

    elegirAccion = (jugador.status.estado === ESTADO_JUGADOR.TURNO || jugador.status.estado === ESTADO_JUGADOR.ACCION_PREVIA || texto ) ? [acciones, dados] : [acciones, dados, botonElegirAccion]

    if (jugador.status.estado === ESTADO_JUGADOR.ACCION_PREVIA && jugador.status.accion_mazo) elegirAccion.push(botonCartaDescarte)
    if(jugador.status.golpe.cartaPalo && jugador.status.golpe.cartaPalo.modificar && jugador.status.estado === ESTADO_JUGADOR.ACCION_PREVIA) {
      elegirAccion.push(botonIncrementar)
      elegirAccion.push(botonDecrementar)
    }
    let alerta = this.state.alerta ? (
      <div className="col-lg-12 margen-top20 alert alert-warning fade in" role="alert">
        <strong>Attention!</strong> {this.state.alerta}
      </div>
    ) : null
    return (
      <div className="col-lg-4 margen-top20">
        <h1 className="tituloJugador" onClick={this.panelClicked}>{this.props.usuario.username}<span className="pull-right"><i className="fa fa-user fa-lg" style={{ color: jugador.color}} aria-hidden="true"></i></span></h1>
        <h2 className="tituloJugador">Points: <span className="pull-right">{jugador.golpes}</span></h2>
        <h2 className="tituloJugador">Progress: <span className="pull-right">{jugador.progreso}</span></h2>
        {elegirGolpe}
        <div className="col-lg-6"><img className="clickable" src={cartaAccion} data-toggle="modal" data-target="#modalAccion" /></div>
        <div className="col-lg-6"><img className="clickable" src={cartaPalo} data-toggle="modal" data-target="#modalPalos" /></div>
        {elegirAccion}
        {botonElegirAccionDado}
        {alerta}
        <CartasModal  cartas={this.mazoAccion()} id="modalAccion" estado={jugador.status.estado} callback={this.cartaElegida}/>
        <CartasModal  cartas={this.mazoPalos()} id="modalPalos" estado={jugador.status.estado} callback={this.paloElegido}/>
        <CartasModal  cartas={this.mazoDescartes()} id="modalDescarte" estado={jugador.status.estado} callback={this.cartaDescarte}/>
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

export default connect(mapStateToProps)(JugadorActivo);
