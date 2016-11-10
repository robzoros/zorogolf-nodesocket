import React, { Component } from 'react'
import ReactDOM from 'react-dom'
import { renderRutasApp } from '../src/api/routes.jsx'


window.onload = () => {
    ReactDOM.render( renderRutasApp(), document.getElementById('container'))
};

