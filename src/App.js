import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import { Col } from 'reactstrap';
import './App.css';
import Header from './Header';
import Map from './components/map/Map';
import InfoTexts from './components/info/InfoTexts';
import BarChart from './components/chart/BarChart';
import DonutChart from './components/chart/DonutChart';
import {
  accidentsData,
  killedData,
  vehicleTypesData,
  causesData
} from './data-helper';

const viewByButtons = [
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

const defaultProvince = 'Tamil Nadu';

class App extends Component {
  state = {
    viewBy: 'numberOfAccidents',
    selectedState: defaultProvince,
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
    const { viewBy, selectedState, barChart, donutChart } = this.state;

    return [
      <Header
        key="header"
        buttonsList={viewByButtons}
        viewBy={viewBy}
        onRadioBtnClick={this.handleRadioButtonClick}
      />,
      <div key="body" className="row h-100 mt-1">
        <Col md="7" className="mapContainer">
          <Map
            data={viewBy === 'numberOfAccidents' ? accidentsData : killedData}
            viewBy={viewBy}
            onEachFeature={this.handleEachFeatureHighlight}
            defaultProvince={defaultProvince}
          />
        </Col>
        <Col md="5 rightPane">
          <div className="d-flex flex-column justify-content-between h-100">
            <div className="textContainer d-flex ">
              <InfoTexts
                selectedState={selectedState}
                accidentsData={accidentsData}
                killedData={killedData}
              />
            </div>
            <div id="barChart" className="barContainer mt-3">
              <BarChart
                width={barChart.width}
                height={barChart.height}
                data={vehicleTypesData}
                category="vehicleType"
                selectedState={selectedState}
                viewBy={viewByButtons.find(each => each.id === viewBy)}
              />
            </div>
            <div id="donutChart" className="donutContainer mt-3">
              <DonutChart
                width={donutChart.width}
                height={donutChart.height}
                data={causesData}
                category="cause"
                selectedState={selectedState}
                viewBy={viewByButtons.find(each => each.id === viewBy)}
              />
            </div>
          </div>
        </Col>
      </div>
    ];
  }
}

export default App;
