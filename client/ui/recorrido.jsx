import { connect } from 'react-redux';
import React, {Component} from 'react';
import { ESTADO_JUGADOR } from '../api/constantes'
import { getIndiceJugador, hexDestino } from '../api/utiles'
import GreenModal from './green_modal.jsx'
import ResultadoModal from './resultado_modal.jsx'

class Recorrido extends Component{
  constructor(props) {
    super(props);

    this.state = {
      hex_destino: {elegido: false, cx:0, cy:0 }
    }

    this.getCoordenadas= this.getCoordenadas.bind(this)
  }

  getCoordenadas(evt) {
    if (this.props.estado === ESTADO_JUGADOR.GOLPE){
      if (evt.target.tagName === 'polygon'){
        this.setState({hex_destino: hexDestino(evt.target)})
        this.props.direccion(evt.target.id)
      }
    }
  }

  componentDidMount() {
    let hex_destino = this.props.hexagono ? hexDestino(document.getElementById(this.props.hexagono)) : {elegido: false, cx:0, cy:0 }
    this.setState({hex_destino})
  }

  render(){
    let indice = getIndiceJugador(this.props.datos.jugadores,  this.props.usuario.name)
    let resultado = this.props.datos.jugadores[indice].status.resultado
    return <div className="col text-center">
      <h1 className="clickable" data-toggle="modal" data-target="#modalGreen">Hole {this.props.hoyo_actual.hoyo}</h1>
      <svg height={this.props.svg.largo/2} id="svg2" width={this.props.svg.ancho/2} version="1.1" viewBox={"0 0 " + this.props.svg.ancho +" " + this.props.svg.largo} onClick={this.getCoordenadas}>
        {this.props.svg.filas}
        {this.state.hex_destino.elegido ? <circle cx={this.state.hex_destino.cx} cy={this.state.hex_destino.cy} r="15" stroke="black" strokeWidth="5" fill="grey" /> : ""}
        <circle className="clickable" cx={this.props.svg.ficha.cx} cy={this.props.svg.ficha.cy} r="15" stroke="black" strokeWidth="5" fill={this.props.svg.ficha.color} data-toggle="modal" data-target="#resultadoModal"/>
      </svg>
      <GreenModal id="modalGreen" callback={this.props.boteGreen} />
      <ResultadoModal id="resultadoModal" resultado={resultado} />
    </div>
  }
}

function mapStateToProps(state) {
  return {
    usuario: state.usuario,
    datos:state.datos,
    hoyo_actual: state.hoyo_actual
  }
}

export default connect(mapStateToProps)(Recorrido);
