import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Col } from 'reactstrap';
import './App.css';
import Map from './map/Map';
import RadioButton from './common/RadioButton';
const shapeFile = require('./data/states.json');
const accidentsTotalData = require('./data/accidents_total_share_plp.json');
const killedTotalData = require('./data/killed_total_share_plp.json');

class App extends Component {
  state = {
    viewBy: 'numberOfAccidents'
  };

  viewByButtons = [
    {
      id: 'numberOfAccidents',
      name: 'Number of Accidents'
    },
    {
      id: 'personsKilled',
      name: 'Persons Killed'
    }
  ];

  handleRadioButtonClick = selected => {
    this.setState({ viewBy: selected });
  };

  render() {
    const accidentsGeoData = shapeFile.features.map(shape => {
      const obj = Object.assign({}, shape);
      const accData = accidentsTotalData.find(
        state => state.name === obj.properties.name
      );
      obj.properties = { ...accData };
      return obj;
    });

    const KilledGeoData = shapeFile.features.map(shape => {
      const obj = Object.assign({}, shape);
      const killedData = killedTotalData.find(
        state => state.name === obj.properties.name
      );
      obj.properties = { ...killedData };
      return obj;
    });

    return [
      <div
        key="header"
        className="appHeader d-flex justify-content-between p-3"
      >
        <span className="appTitle">Accidents In India - 2016</span>
        <div className="d-flex">
          <span className="mr-3">View by:</span>
          <RadioButton
            buttonsList={this.viewByButtons}
            active={this.state.viewBy}
            onRadioBtnClick={this.handleRadioButtonClick}
          />
        </div>
      </div>,
      <div key="body" className="row h-100 mt-1">
        <Col xs="12" className="mapContainer">
          <Map
            data={
              this.state.viewBy === 'numberOfAccidents'
                ? accidentsGeoData
                : KilledGeoData
            }
            viewBy={this.state.viewBy}
          />
        </Col>
        <Col xs="3" />
      </div>
    ];
  }
}

export default App;
