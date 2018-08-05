import React from 'react';
import ReactDOM from 'react-dom';
import L from 'leaflet';
import { MapControl, withLeaflet } from 'react-leaflet';

class LegendControl extends MapControl {
  componentWillMount() {
    const legend = L.control({ position: 'bottomright' });
    const jsx = <div {...this.props}>{this.props.children}</div>;

    legend.onAdd = function(map) {
      let div = L.DomUtil.create('div', '');
      ReactDOM.render(jsx, div);
      return div;
    };

    this.leafletElement = legend;
  }
  createLeafletElement() {}
}

export default withLeaflet(LegendControl);
