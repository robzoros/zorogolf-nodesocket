import { connect } from 'react-redux'
import React, { Component } from 'react'
import ItemPartida from './item_partida.jsx'
import {LISTA_PARTIDAS} from '../api/constantes'


// Clase Lista de Partidas
class ListaPartidas extends Component {
  constructor(props) {
    super(props);
    this.state = {}
    this.partidas = this.partidas.bind(this)
  }

  partidas() {
    //let filtroSE = (this.props.usuario.logado ?  {jugadores: { $not: {$elemMatch: {nombre:this.props.usuario.username}}}, "jugadores.3": {$exists: false} } : {"jugadores.3": {$exists: false}} )
    //let filtroPR = (this.props.usuario.logado ?  {"jugadores.nombre":this.props.usuario.username} : {} )
    let filtroSE = (e) => { return (e.jugadores.length < 4 && e.jugadores.filter((j) => {return j.nombre === this.props.usuario.name}).length === 0) }
    let filtroPR = (e) => { return e.jugadores.filter((j) => {return j.nombre === this.props.usuario.name}).length > 0 }
    let filtro = (this.props.lista === LISTA_PARTIDAS.SIN_EMPEZAR ? filtroSE : filtroPR )
    return this.props.partidas.filter(filtro);
  }

  render() {
    let lista_partidas = this.partidas() 
    let titulo = ( this.props.lista === LISTA_PARTIDAS.SIN_EMPEZAR 
      ? "Games waiting players" 
      : "Games of " + ( this.props.usuario.logado ? this.props.usuario.name : "" ) 
    )
    let clase = "col-xs-10 col-5 margen-top20 panel-lista-partidas-interior" 
      + (this.props.lista === LISTA_PARTIDAS.SIN_EMPEZAR ? " offset-1" : " margen-izquierdo")
    let lista_items = lista_partidas.length > 0
      ? ( lista_partidas.map((partida, indice) => 
        { return <ItemPartida key={partida._id} partida={partida} indice={indice} lista={this.props.lista} /> }) ) 
      : []

    return (
      <div className={clase}>
        <h2>{titulo}</h2>
        {lista_items}
      </div>
    )
  }
}

function mapStateToProps(state) {
  return {
    usuario: state.usuario,
    datos: state.datos,
    partidas: state.partidas
  }
}

export default connect(mapStateToProps)(ListaPartidas)