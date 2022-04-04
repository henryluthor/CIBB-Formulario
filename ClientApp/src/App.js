import React, { Component } from 'react';
import { Route } from 'react-router';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { FetchData } from './components/FetchData';
import { Counter } from './components/Counter';
import { Formulario } from './components/Formulario';

import './custom.css'

export default class App extends Component {
  static displayName = App.name;

  render () {
    return (
      <Layout>
        <div>
                <center>
                    <p>VI Congreso Internacional de Biotecnolog&iacute;a y Biodiversidad</p>
                    <p>CIBB 2022</p>
                    <p>- MODALIDAD VIRTUAL -</p>
                </center>
                <p>Formulario de Registro: VI CIBB 2022</p>
                <Formulario />
        </div>
      </Layout>
    );
  }
}
