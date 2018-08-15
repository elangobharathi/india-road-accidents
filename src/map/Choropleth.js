import React, { Component } from 'react';
import { arrayOf, shape, string, func } from 'prop-types';
import L from 'leaflet';
import LeafletChoropleth from 'react-leaflet-choropleth';
import Control from './Control';

class Choropleth extends Component {
  isDefaultFeature = true;
  chroplethRef = React.createRef();
  componentWillMount() {
    const legendColors = this.props.choroplethConfig.legendColor.map(color => (
      <li key={color} style={{ backgroundColor: color }} />
    ));

    this.legend = (
      <div>
        <div className="min">low</div>
        <div className="max">high</div>
        <ul> {legendColors} </ul>
      </div>
    );
  }

  componentDidMount() {
    this.highlightDefaultFeature();
  }

  previousSelection = null;

  highlightFeature = layer => {
    layer.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.8
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      layer.bringToFront();
    }
  };

  dehighlightFeature = layer => {
    layer.setStyle({
      weight: 0.5,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.8
    });
  };

  getLayer = stateName => {
    const layers = this.chroplethRef.current.leafletElement.getLayers();
    const layer = layers.find(
      layer => layer.options.data.properties.name === stateName
    );

    return layer;
  };

  highlightDefaultFeature = () => {
    const layer = this.getLayer(this.props.defaultState);
    this.highlightFeature(layer);
  };

  dehighlightDefaultFeature = () => {
    const layer = this.getLayer(this.props.defaultState);
    this.dehighlightFeature(layer);
    this.isDefaultFeature = false;
  };

  handleMouseOver = e => {
    if (this.isDefaultFeature) {
      this.dehighlightDefaultFeature();
    }
    this.highlightFeature(e.target);
    this.props.onEachFeatureSelect(e.target.feature.properties);
  };

  handleMouseOut = e => {
    this.dehighlightFeature(e.target);
  };

  handleClick = e => {
    if (this.isDefaultFeature) {
      this.dehighlightDefaultFeature();
    }
    if (this.previousSelection) {
      this.dehighlightFeature(this.previousSelection);
    }

    this.highlightFeature(e.target);
    this.props.onEachFeatureSelect(e.target.feature.properties);
    this.previousSelection = e.target;
  };

  render() {
    return [
      <LeafletChoropleth
        key={this.props.viewBy}
        ref={this.chroplethRef}
        data={this.props.data}
        valueProperty={this.props.valueProperty}
        colors={this.props.choroplethConfig.legendColor}
        steps={this.props.choroplethConfig.steps}
        mode={this.props.choroplethConfig.mode}
        style={this.props.choroplethConfig.style}
        onEachFeature={(feature, layer) => {
          layer.on({
            mouseover: this.handleMouseOver,
            mouseout: this.handleMouseOut,
            click: this.handleClick
          });
        }}
      />,
      <Control className="info legend" position="bottomright" key="legend">
        {this.legend}
      </Control>
    ];
  }
}

Choropleth.defaultProps = {
  colors: [
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
  style: {
    weight: 0.5,
    opacity: 1,
    color: 'white',
    dashArray: '3',
    fillOpacity: 0.7
  }
};

Choropleth.propTypes = {
  shapeDisplayProp: string.isRequired,
  data: shape({
    type: string,
    features: arrayOf(shape)
  }).isRequired,
  valueProperty: func.isRequired,
  choroplethConfig: shape({}).isRequired,
  onEachFeatureSelect: func.isRequired,
  defaultState: string.isRequired
};

export default Choropleth;
