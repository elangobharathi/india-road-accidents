import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Col } from 'reactstrap';
import './App.css';
import Map from './Map';

class App extends Component {
  render() {
    return [
      <header key="header" className="appHeader p-3">
        <h3 className="appTitle">Accidents In India - 2016</h3>
      </header>,
      <div key="body" className="row h-100 mt-1">
        <Col xs="12" className="mapContainer">
          <Map />
        </Col>
        <Col xs="3" />
      </div>
    ];
  }
}

export default App;
