import { connect } from 'react-redux';
import React, {Component} from 'react';
import {ESTADO_JUGADOR} from '../api/constantes'
import { renderGreen } from '../api/crear_campo.jsx'
import Dado from './dado.jsx'

export default class ResultadoModal extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    let listaCE = this.props.resultado ? this.props.resultado.cartas_evento : []
    let listaA = this.props.resultado ? this.props.resultado.acciones : []
    return (
      <div className="modal fade" id={this.props.id} tabindex="-1" role="dialog" aria-labelledby="myModalLabel">
        <div className="modal-dialog modal-lg" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <button type="button" className="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <h4 className="modal-title" id="myModalLabel">Final result</h4>
            </div>
            <div className="modal-body">
              <div className="container-fluid">
                {listaCE.map( (carta, indice) => {
                  return <div key={indice} id={carta.fichero} className="col-lg-3 col-md-4 col-xs-6 text-center">
                    <div className="thumbnail" id={carta.fichero+indice}><img className="img-responsive" src={carta.fichero} /></div>
                  </div>
                })}
              </div>
              <div className="margen-top20">
                {listaA.map((accion, indice) => {
                  let dado = accion.dado ? accion.dado : {color: 'ivory', valor: 0}
                  return  <label key={"accion" + indice} className={"btn btn-primary btn-margen"}>
                            <input type="radio" autocomplete="off" value={indice} />
                            <Dado dado={dado} />
                          </label>
                })}
              </div>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-default" data-dismiss="modal" aria-label="Close">Ok</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
};
