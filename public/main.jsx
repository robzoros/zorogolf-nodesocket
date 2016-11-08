import React, { Component } from 'react';
import { render } from 'react-dom';

import routes  from './app/api/routes.jsx';
import Bootstrap from './app/bower/bootstrap-without-jquery.min.js'

class renderRoutes extends  Component {
    render() {
        return <Router history={browserHistory} routes={routes} />
    }
}

render( <renderRoutes />, document.getElementById('container'))
