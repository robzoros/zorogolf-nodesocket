import { connect } from 'react-redux';
import React, {Component} from 'react';
import {ESTADO_JUGADOR} from '../api/constantes'

export default class CartasModal extends Component {
  constructor(props) {
    super(props);
    let titulo = ""
    switch (this.props.id) {
      case "modalAccion":
        titulo = "Choose Action Card"
        break
      case "modalPalos":
        titulo = "Choose Club"
        break
      case "modalDescarte":
        titulo = "Choose Action Card to recover"
        break
      default:
        break

    }
    this.state = {
      titulo
    }

    this.selected = this.selected.bind(this)
    this.ok = this.ok.bind(this)
  }

  selected(event){
    if(event)
      if (this.props.estado === ESTADO_JUGADOR.GOLPE ) {
        let tag = event.target.tagName.toUpperCase()
        if (tag === 'IMG' || event.target.className === 'thumbnail') {
          let element = tag === 'IMG' ? event.target.parentNode.parentNode : event.target.parentNode
          let div = tag === 'IMG' ? event.target.parentNode : event.target
          div.style.backgroundColor = 'grey'
          if (this.state.div) document.getElementById(this.state.div).style.backgroundColor = 'white'
          this.setState({idCarta: element.id, div: div.id})
        }
      }
  }

  ok() {
    if (this.props.estado === ESTADO_JUGADOR.GOLPE ) this.props.callback(this.state.idCarta)
  }

  render() {
    return (
      <div className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">{this.state.titulo}</h4>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
              {this.props.cartas.map( (file, indice) => {
                return <div key={indice} id={file} className="col-lg-3 col-md-4 col-xs-6 text-center" onClick={this.selected}>
                  <div className="thumbnail" id={file+indice}><img className="img-responsive" src={file} /></div>
                </div>
              })}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal" aria-label="Close" onClick={this.ok}>Ok</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
};
