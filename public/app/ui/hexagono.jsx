import React, {Component} from 'react';
import {CONST_HEX} from '../api/constantes'

export default class Hexagono extends Component
{
  constructor(props) {
    super(props);
  };

  obtenerPuntos() {
      let cx = this.props.cx
      let cy = this.props.cy
      let radio = this.props.radio
      let r = radio/2
      let a = r * this.props.ratio
      let rotar = this.props.rotado
      let x
      let y
      let puntos
      if(rotar) {
        y = Number(cy) - a
        x = Number(cx) + r
        puntos = x + "," + y
        y += a
        x += r
        puntos += " " + x + "," + y
        y += a
        x -= r
        puntos += " " + x + "," + y
        x -= r*2
        puntos += " " + x + "," + y
        y -= a
        x -= r
        puntos += " " + x + "," + y
        y -= a
        x += r
        puntos += " " + x + "," + y
      }
      else {
        x = Number(cx) - a
        y = Number(cy) + r
        puntos = x + "," + y
        x += a
        y += r
        puntos += " " + x + "," + y
        x += a
        y -= r
        puntos += " " + x + "," + y
        y -= r*2
        puntos += " " + x + "," + y
        x -= a
        y -= r
        puntos += " " + x + "," + y
        x -= a
        y += r
        puntos += " " + x + "," + y
      }
      return puntos
  }

  render() {
    return <polygon id={this.props.id}
      points={this.obtenerPuntos()}
      style={this.props.estilo}/>
  }

};
