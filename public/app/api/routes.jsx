import React from 'react'
import { Router, Route, hasHistory } from 'react-router'
import { Provider } from 'react-redux'

// route components
import Inicio from '../ui/app.jsx'
/*import Principal from '../ui/barra_nav.jsx'
import PartidasUI  from '../ui/partidas.jsx'
import Partida  from '../ui/partida.jsx'
import Store from './store/store' */

const routes = (
    <Route path="/" component={Inicio} />
)

export default routes
