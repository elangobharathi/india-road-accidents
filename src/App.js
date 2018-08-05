import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Col } from 'reactstrap';
import './App.css';
import Map from './map/Map';
const shapeFile = require('./data/states.json');
const accidentsTotalData = require('./data/accidents_total_share_plp.json');

class App extends Component {
  render() {
    console.log(shapeFile);
    console.log(accidentsTotalData);

    const accidentsGeoData = shapeFile.features.map(shape => {
      const obj = Object.assign({}, shape);
      const accData = accidentsTotalData.find(
        state => state.name === obj.properties.name
      );
      obj.properties = { ...accData };
      return obj;
    });

    return [
      <header key="header" className="appHeader p-3">
        <h3 className="appTitle">Accidents In India - 2016</h3>
      </header>,
      <div key="body" className="row h-100 mt-1">
        <Col xs="12" className="mapContainer">
          <Map data={accidentsGeoData} />
        </Col>
        <Col xs="3" />
      </div>
    ];
  }
}

export default App;
