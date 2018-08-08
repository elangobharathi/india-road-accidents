import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Col } from 'reactstrap';
import './App.css';
import Map from './map/Map';
import RadioButton from './common/RadioButton';
import InfoTexts from './InfoTexts';
const shapeFile = require('./data/states.json');
const accidentsTotalData = require('./data/accidents_total_share_plp.json');
const killedTotalData = require('./data/killed_total_share_plp.json');

class App extends Component {
  defaultState = 'Tamil Nadu';
  state = {
    viewBy: 'numberOfAccidents',
    selectedState: this.defaultState
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

  handleEachFeatureHighlight = feature => {
    this.setState({ selectedState: feature.name });
  };
  accidentsGeoData = {};
  killedGeoData = {};

  render() {
    this.accidentsGeoData = shapeFile.features.map(shape => {
      const obj = Object.assign({}, shape);
      const accData = accidentsTotalData.find(
        state => state.name === obj.properties.name
      );
      obj.properties = { ...accData };
      return obj;
    });

    this.killedGeoData = shapeFile.features.map(shape => {
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
        <div className="d-flex viewContainer">
          <span className="mr-3">View by:</span>
          <RadioButton
            buttonsList={this.viewByButtons}
            active={this.state.viewBy}
            onRadioBtnClick={this.handleRadioButtonClick}
          />
        </div>
      </div>,
      <div key="body" className="row h-100 mt-1">
        <Col xs="8" className="mapContainer">
          <Map
            data={
              this.state.viewBy === 'numberOfAccidents'
                ? this.accidentsGeoData
                : this.killedGeoData
            }
            viewBy={this.state.viewBy}
            onEachFeature={this.handleEachFeatureHighlight}
            defaultState={this.defaultState}
          />
        </Col>
        <Col xs="4 infoContainer">
          <InfoTexts
            selectedState={this.state.selectedState}
            accidentsData={this.accidentsGeoData}
            killedData={this.killedGeoData}
          />
        </Col>
      </div>
    ];
  }
}

export default App;
