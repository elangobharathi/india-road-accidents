import React, { Component } from 'react';
import { arrayOf, shape, string, func } from 'prop-types';
import L from 'leaflet';
import LeafletChoropleth from 'react-leaflet-choropleth';
import Control from './Control';
import { checkDecimal } from '../utils';

class Choropleth extends Component {
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

  handleMouseOver = e => {
    const featureShape = e.target;
    featureShape.setStyle({
      weight: 5,
      color: '#666',
      dashArray: '',
      fillOpacity: 0.8
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
      featureShape.bringToFront();
    }
  };

  handleMouseOut = e => {
    const featureShape = e.target;
    featureShape.setStyle({
      weight: 0.5,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.8
    });
  };

  constructTooltip = (feature, defaultDisplayProp, displayPropsList) => {
    let toolTipString = `<strong>${
      feature.properties[defaultDisplayProp]
    }</strong>`;
    displayPropsList.forEach(displayItem => {
      const value = feature.properties[displayItem.id];
      const str = `${displayItem.name}: ${
        checkDecimal(value) ? value.toFixed(2) : value
      }`;
      toolTipString = `${toolTipString} <br> ${str}`;
    });

    return toolTipString;
  };

  render() {
    return [
      <LeafletChoropleth
        key={this.props.viewBy}
        data={this.props.data}
        valueProperty={this.props.valueProperty}
        colors={this.props.choroplethConfig.legendColor}
        steps={this.props.choroplethConfig.steps}
        mode={this.props.choroplethConfig.mode}
        style={this.props.choroplethConfig.style}
        onEachFeature={(feature, layer) => {
          layer.bindTooltip(
            this.constructTooltip(
              feature,
              this.props.shapeDisplayProp,
              this.props.choroplethConfig.displayPropsList
            )
          );
          layer.on({
            mouseover: this.handleMouseOver,
            mouseout: this.handleMouseOut
          });
        }}
      />,
      <Control className="info legend" position="bottomleft" key="legend">
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
  choroplethConfig: shape({}).isRequired
};

export default Choropleth;
