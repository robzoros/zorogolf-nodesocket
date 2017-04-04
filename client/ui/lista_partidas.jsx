import React, {Component} from 'react'
import ItemPartida from './item_partida.jsx'
import {LISTA_PARTIDAS} from '../api/constantes'


// Clase Lista de Partidas
export default class ListaPartidas extends Component {
  constructor(props) {
    super(props);
    this.state = {}
  }

  partidas() {
    let filtroSE = (this.props.usuario.logado ?  {jugadores: { $not: {$elemMatch: {nombre:this.props.usuario.username}}}, "jugadores.3": {$exists: false} } : {"jugadores.3": {$exists: false}} )
    let filtroPR = (this.props.usuario.logado ?  {"jugadores.nombre":this.props.usuario.username} : {} )
    let filtro = (this.props.lista === LISTA_PARTIDAS.SIN_EMPEZAR ? filtroSE : filtroPR )
    //return Partidas.find(filtro).fetch();
  }

  render() {
    let titulo = (this.props.lista === LISTA_PARTIDAS.SIN_EMPEZAR ? "Games waiting players" : (this.props.usuario.logado ? this.props.usuario.username : "") )

    return <div className="container-fluid col-xs-8 col-md-6 col-sd-6 col-lg-5 margen-top20">
          <div className="panel panel-default">
            <div className="panel-heading">{titulo}</div>
              <div className="panel-body">
              {this.props.partidas.map((partida, indice) => {
                  return <ItemPartida key={partida._id} partida={partida} indice={indice} lista={this.props.lista} />
                })}
            </div>
          </div>
        </div>
  }
}
