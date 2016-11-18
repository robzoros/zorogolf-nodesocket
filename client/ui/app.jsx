import React, {Component} from 'react';
import { Link } from 'react-router';

export default class Inicio extends Component {
  render() {
    return <header>
        <div className="header-content">
          <div className="header-content-inner">
            <h1>Help to develop Zorogolf</h1>
            <hr/>
            <p>Zorogolf is a board game designed by Roberto Méndez that simulates a golf game match. Learn to play Zorogolf and help to develop the game.</p>
            <Link to="/partidas" className="btna btn-primary btn-xl page-scroll">Continue</Link>
          </div>
        </div>
      </header>
  }
}
