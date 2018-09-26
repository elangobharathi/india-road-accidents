import React from 'react';
import { arrayOf, func, shape, string } from 'prop-types';
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

const config = {
  url: 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
  attribution:
    '&copy; <a href=&quot;http://osm.org/copyright&quot;>OpenStreetMap</a> contributors &copy; <a href=&quot;https://carto.com/attribution/&quot;>CARTO</a>',
  center: [21.40400157264266, 82.21343994140626], // [lat, lng]
  zoomLevel: 5
};

const choroplethConfig = {
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

const Map = ({ viewBy, data, onEachFeature, defaultProvince }) => {
  const choroplethLayer = (
    <Choropleth
      viewBy={viewBy}
      choroplethConfig={choroplethConfig}
      shapeDisplayProp="name"
      data={{
        type: 'FeatureCollection',
        features: data
      }}
      valueProperty={feature => feature.properties['perLakhPopulation']}
      onEachFeatureSelect={onEachFeature}
      defaultProvince={defaultProvince}
    />
  );

  return (
    <LeafletMap center={config.center} zoom={config.zoomLevel}>
      <TileLayer url={config.url} attribution={config.attribution} />
      {choroplethLayer}
    </LeafletMap>
  );
};

Map.propTypes = {
  data: arrayOf(shape).isRequired,
  viewBy: string.isRequired,
  onEachFeature: func.isRequired,
  defaultProvince: string.isRequired
};

export default Map;
