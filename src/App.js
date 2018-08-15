import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Col } from 'reactstrap';
import './App.css';
import Map from './map/Map';
import RadioButton from './common/RadioButton';
import InfoTexts from './info/InfoTexts';
import BarChart from './chart/BarChart';
import DonutChart from './chart/DonutChart';

const data = {
  shapeFile: require('./data/states.json'),
  accidentsTotal: require('./data/accidents_total_share_plp.json'),
  killed: require('./data/killed_total_share_plp.json'),
  vehicleTypes: require('./data/vehicle_types.json'),
  causes: require('./data/causes.json')
};

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

  render() {
    const accidentsGeoData = data.shapeFile.features.map(shape => {
      const obj = Object.assign({}, shape);
      const accData = data.accidentsTotal.find(
        state => state.name === obj.properties.name
      );
      obj.properties = { ...accData };
      return obj;
    });

    const killedGeoData = data.shapeFile.features.map(shape => {
      const obj = Object.assign({}, shape);
      const killedData = data.killed.find(
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
                ? accidentsGeoData
                : killedGeoData
            }
            viewBy={this.state.viewBy}
            onEachFeature={this.handleEachFeatureHighlight}
            defaultState={this.defaultState}
          />
        </Col>
        <Col md="5 rightPane">
          <div className="d-flex flex-column justify-content-between h-100">
            <div className="textContainer d-flex ">
              <InfoTexts
                selectedState={this.state.selectedState}
                accidentsData={accidentsGeoData}
                killedData={killedGeoData}
              />
            </div>
            <div id="barChart" className="barContainer mt-3">
              <BarChart
                width={this.state.barChart.width}
                height={this.state.barChart.height}
                data={data.vehicleTypes}
                selectedState={this.state.selectedState}
                viewBy={this.viewByButtons.find(
                  each => each.id === this.state.viewBy
                )}
              />
            </div>
            <div id="donutChart" className="donutContainer mt-3">
              <DonutChart
                width={this.state.donutChart.width}
                height={this.state.donutChart.height}
                data={data.causes}
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
