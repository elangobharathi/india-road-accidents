import React, { Component } from 'react';
import { arrayOf, shape, string } from 'prop-types';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
import Choropleth from './Choropleth';

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

class Map extends Component {
  config = {
    url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    attribution:
      '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors &copy; <a href=&quot;https://carto.com/attribution/&quot;>CARTO</a>',
    center: [20.5937, 78.9629], // [lat, lng]
    zoomLevel: 5
  };

  choroplethConfig = {
    style: {
      weight: 0.5,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.8
    },
    legendColor: [
      '#FFEDA0',
      '#FED976',
      '#FEB24C',
      '#FD8D3C',
      '#FC4E2A',
      '#E31A1C',
      '#BD0026',
      '#800026'
    ],
    steps: 8,
    mode: 'q',
    displayPropsList: [
      {
        id: 'total',
        name: 'Total'
      },
      {
        id: 'share',
        name: 'Share'
      },
      {
        id: 'perLakhPopulation',
        name: 'Per Lakh Population'
      }
    ]
  };

  render() {
    const choroplethLayer = (
      <Choropleth
        viewBy={this.props.viewBy}
        choroplethConfig={this.choroplethConfig}
        shapeDisplayProp="name"
        data={{
          type: 'FeatureCollection',
          features: this.props.data
        }}
        valueProperty={feature => feature.properties['perLakhPopulation']}
      />
    );

    return (
      <LeafletMap center={this.config.center} zoom={this.config.zoomLevel}>
        <TileLayer
          url={this.config.url}
          attribution={this.config.attribution}
        />
        {choroplethLayer}
      </LeafletMap>
    );
  }
}

Map.propTypes = {
  data: arrayOf(shape).isRequired,
  viewBy: string.isRequired
};

export default Map;
