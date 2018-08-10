import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Col } from 'reactstrap';
import './App.css';
import Map from './map/Map';
import RadioButton from './common/RadioButton';
import InfoTexts from './InfoTexts';
import BarChart from './chart/BarChart';
const shapeFile = require('./data/states.json');
const accidentsTotalData = require('./data/accidents_total_share_plp.json');
const killedTotalData = require('./data/killed_total_share_plp.json');
const vehicleTypesData = require('./data/vehicle_types.json');

class App extends Component {
  defaultState = 'Tamil Nadu';
  state = {
    viewBy: 'numberOfAccidents',
    selectedState: this.defaultState,
    barChart: {
      width: 400,
      height: 400
    }
  };

  componentDidMount() {
    this.updateWindowDimensions();
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

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

  updateWindowDimensions = () => {
    this.setState({
      barChart: {
        width: document.getElementById('barChart').clientWidth,
        height: document.getElementById('barChart').clientHeight
      }
    });
  };

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
        <span className="appTitle">Road Accidents In India - 2016</span>
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
        <Col xs="7" className="mapContainer">
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
        <Col xs="5 infoContainer">
          <InfoTexts
            selectedState={this.state.selectedState}
            accidentsData={this.accidentsGeoData}
            killedData={this.killedGeoData}
          />
          <div id="barChart">
            <BarChart
              width={this.state.barChart.width}
              height={this.state.barChart.height}
              data={vehicleTypesData}
              selectedState={this.state.selectedState}
            />
          </div>
        </Col>
      </div>
    ];
  }
}

export default App;
