import React, {Component} from 'react';

export default class Dado extends Component {
  constructor(props) {
    super(props);
  };


  render() {
    let colorPunto = this.props.dado.color === 'Blue' ? '#ffffff' : '#000000'
    let rectangulo = <rect key="rect" ry="105" rx="105" y="10" x="10" height="400" width="400" id="rectangulo" fill={this.props.dado.color} />
    let punto1 = <circle key="punto1" r="45" cx="110" cy="110" id="punto1" fill={colorPunto} />
    let punto2 = <circle key="punto2" r="45" cx="110" cy="210" id="punto2" fill={colorPunto} />
    let punto3 = <circle key="punto3" r="45" cx="110" cy="310" id="punto3" fill={colorPunto} />
    let punto4 = <circle key="punto4" r="45" cx="210" cy="210" id="punto4" fill={colorPunto} />
    let punto5 = <circle key="punto5" r="45" cx="310" cy="110" id="punto5" fill={colorPunto} />
    let punto6 = <circle key="punto6" r="45" cx="310" cy="210" id="punto6" fill={colorPunto} />
    let punto7 = <circle key="punto7" r="45" cx="310" cy="310" id="punto7" fill={colorPunto} />
    let dado = []

    switch (this.props.dado.valor) {
      case 1:
          dado = [rectangulo, punto4]
          break;
      case 2:
          dado = [rectangulo, punto1, punto7]
          break;
      case 3:
          dado = [rectangulo, punto1, punto4, punto7]
          break;
      case 4:
          dado = [rectangulo, punto1, punto3, punto5, punto7]
          break;
      case 5:
          dado = [rectangulo, punto1, punto3, punto4, punto5, punto7]
          break;
      case 6:
          dado = [rectangulo, punto1, punto2, punto3, punto5, punto6, punto7]
          break;
      default:
        dado = [rectangulo]
        break;
    }
    return  <svg version="1.1" id="svg4144" viewBox="0 0 420 420" height="50" width="50">
              {dado}
            </svg>
  }


}
