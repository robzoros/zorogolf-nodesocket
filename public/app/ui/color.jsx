import React, {Component} from 'react'

export default class SelectColor extends Component {
  constructor(props) {
    super(props);

    this.changeColor = this.changeColor.bind(this)
  }

  changeColor() {
    var select = document.getElementById('selectColor' + this.props.indice)
    var boton = document.getElementById('botonColor' + this.props.indice)
    boton.style.backgroundColor = (select.value==='Orange' ? 'sandybrown' : select.value)
    boton.style.color = boton.style.backgroundColor
    boton.style.borderColor = (select.value==='White' ? '#ccc' : select.value)
    this.props.setColor(select.value)
  }

  render() {
    return <div className="input-group">
      <select id={"selectColor" + this.props.indice} className="form-control" onChange={this.changeColor}>
        {this.props.colores.map((color) => {
          return <option key={color}>{color}</option>
        })}
      </select>
      <span className="input-group-btn" >
        <div id={"botonColor" + this.props.indice} className="btn" style={{backgroundColor: this.props.colores[0], color: this.props.colores[0]}}>GO</div>
      </span>
    </div>
  }
}
