import React, {Component} from 'react';

export default class ListaJugadores extends Component {
  constructor(props) {
    super(props);
  };

  render() {
    return <section className='container col-10 col-lg-4 lista-jugadores'>
        <div className="card wheat">
          <div className="card-header">{this.props.nombre}</div>
          <div className="card-block">
            {this.props.jugadores.map((jugador) => {
              return (
                <div key={jugador.nombre} className="row">
                  <div className="col-9">
                    <label className="control-label">{jugador.nombre} </label>
                  </div>
                  <div className="col-1">
                    <i className="fa fa-user fa-lg" style={{ color: jugador.color}} aria-hidden="true"></i>
                  </div>
                </div>)
            })}
          </div>
        </div>
      </section>
  }
}
