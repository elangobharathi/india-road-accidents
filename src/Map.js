import React, { Component } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import './Map.css';
import { Map as LeafletMap, TileLayer } from 'react-leaflet';
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

  render() {
    return (
      <LeafletMap center={this.config.center} zoom={this.config.zoomLevel}>
        <TileLayer
          url={this.config.url}
          attribution={this.config.attribution}
        />
      </LeafletMap>
    );
  }
}

export default Map;
