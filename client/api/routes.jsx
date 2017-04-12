import React from 'react'
import { Router, Route, browserHistory } from 'react-router'
import { Provider } from 'react-redux'

// route components
import Inicio from '../ui/app.jsx'
import Principal from '../ui/barra_nav.jsx'
import PartidasUI  from '../ui/partidas.jsx'
import Partida  from '../ui/partida.jsx'
import Store from './redux/store'

export const renderRutasApp = () => (
    <Provider store={Store}>
        <Router history={browserHistory}>
            <Route path="/" component={Inicio} />
            <Route component={Principal}>
                <Route path="/partidas" component={PartidasUI}/>
                <Route path="/partida/:id" component={Partida}/>
            </Route>
        </Router>
    </Provider>
);