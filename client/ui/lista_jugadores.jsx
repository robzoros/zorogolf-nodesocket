import React, {Component} from 'react';
import { browserHistory } from 'react-router'

export default class ListaJugadores extends Component {
  constructor(props) {
    super(props);
  };

  componentWillReceiveProps(nextProps){
    for(let i=this.props.jugadores.length;i<nextProps.jugadores.length;i++){
      this.props.funcionJ(nextProps.jugadores[i])
    }
    if (nextProps.jugadores.length === 4) {
      Meteor.call('addCampo', this.props.id, this.props.campo, (error, result) => {
        console.log(result)
        if (result) {
          this.props.funcionC(result)
          browserHistory.push('/Partida/' + this.props.id)
        }
      })
    }
  }

  render() {
    return <section className='container col-10 col-lg-4 margen-top20'>
        <div className="card wheat">
          <div className="card-header">{this.props.nombre}</div>
          <div className="card-block">
            {this.props.jugadores.map((jugador) => {
              return (
                <div key={jugador.nombre} className="row">
                  <div className="col-xs-10 col-lg-8">
                    <label className="control-label">{jugador.nombre} </label>
                  </div>
                  <div className="col-xs-1 col-lg-1">
                    <i className="fa fa-user fa-lg" style={{ color: jugador.color}} aria-hidden="true"></i>
                  </div>
                </div>)
            })}
          </div>
        </div>
      </section>
  }
}
