import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Col } from 'reactstrap';
import './App.css';
import Map from './map/Map';
import RadioButton from './common/RadioButton';
import InfoTexts from './InfoTexts';
import BarChart from './chart/BarChart';
import DonutChart from './chart/DonutChart';
const shapeFile = require('./data/states.json');
const accidentsTotalData = require('./data/accidents_total_share_plp.json');
const killedTotalData = require('./data/killed_total_share_plp.json');
const vehicleTypesData = require('./data/vehicle_types.json');
const causesData = require('./data/causes.json');

class App extends Component {
  defaultState = 'Tamil Nadu';
  state = {
    viewBy: 'numberOfAccidents',
    selectedState: this.defaultState,
    barChart: {
      width: 300,
      height: 300
    },
    donutChart: {
      width: 200,
      height: 200
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
      name: 'Number of Accidents',
      vehicleDataRef: 'accidentsTotal'
    },
    {
      id: 'personsKilled',
      name: 'Persons Killed',
      vehicleDataRef: 'personsKilled'
    }
  ];

  updateWindowDimensions = () => {
    this.setState({
      barChart: {
        width: document.getElementById('barChart').clientWidth,
        height: document.getElementById('barChart').clientHeight
      },
      donutChart: {
        width: document.getElementById('donutChart').clientWidth,
        height: document.getElementById('donutChart').clientHeight
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
        <Col md="7" className="mapContainer">
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
        <Col md="5 rightPane">
          <div className="infoContainer flex-fill d-flex flex-column justify-content-between">
            <div className="textsDiv">
              <InfoTexts
                selectedState={this.state.selectedState}
                accidentsData={this.accidentsGeoData}
                killedData={this.killedGeoData}
              />
            </div>
            <div id="barChart" className="barChart mt-2">
              <BarChart
                width={this.state.barChart.width}
                height={this.state.barChart.height}
                data={vehicleTypesData}
                selectedState={this.state.selectedState}
                viewBy={this.viewByButtons.find(
                  each => each.id === this.state.viewBy
                )}
              />
            </div>
            <div id="donutChart" className="donutChart mt-3">
              <DonutChart
                width={this.state.donutChart.width}
                height={this.state.donutChart.height}
                data={causesData}
                selectedState={this.state.selectedState}
                viewBy={this.viewByButtons.find(
                  each => each.id === this.state.viewBy
                )}
              />
            </div>
          </div>
        </Col>
      </div>
    ];
  }
}

export default App;
