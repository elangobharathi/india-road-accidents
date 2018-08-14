import React, { Component } from 'react';
import { arrayOf, shape, number, string } from 'prop-types';
import * as d3 from 'd3';
import './chart.css';

class DonutChart extends Component {
  componentDidMount() {
    this.initializeParameters(this.props);
    this.renderChart();
  }

  shouldComponentUpdate(nextProps) {
    let shoudUpdate = false;
    if (
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height ||
      this.props.selectedState !== nextProps.selectedState ||
      this.props.viewBy.id !== nextProps.viewBy.id
    ) {
      this.resetChart(nextProps);
      shoudUpdate = true;
    }

    return shoudUpdate;
  }

  componentDidUpdate() {
    this.renderChart();
  }

  donutChartRef = React.createRef();
  percentFormat = d3.format(',.2%');

  resetChart = props => {
    this.svg.remove();
    this.legend.selectAll('.key').remove();
    this.initializeParameters(props);
  };

  initializeParameters = currentProps => {
    const svgRef = d3.select(this.donutChartRef.current);
    const width = currentProps.width / 2;
    const height = currentProps.height;
    const margin = { top: 10, right: 0, bottom: 10, left: 0 };
    const padAngle = 0.015;
    const floatFormat = d3.format('.4r');
    const cornerRadius = 3;

    this.radius = Math.min(width, height) / 2;
    this.colorScale = d3.scaleOrdinal([
      '#800026',
      '#268000',
      '#004d80',
      '#FC4E2A',
      '#806d00',
      '#FEB24C',
      '#800066',
      '#CC6EAE'
    ]);
    this.value = currentProps.viewBy.vehicleDataRef;
    this.category = 'cause';
    this.legend = d3.select('.donutLegend');

    this.pie = d3
      .pie()
      .value(d => floatFormat(d[this.value]))
      .sort(null);

    this.arc = d3
      .arc()
      .outerRadius(this.radius * 0.95)
      .innerRadius(this.radius * 0.3)
      .cornerRadius(cornerRadius)
      .padAngle(padAngle);

    this.svg = svgRef
      .append('g')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .attr('transform', `translate(${width / 2},${height / 2})`);

    this.svg.append('g').attr('class', 'slices');
  };

  renderChart = () => {
    const data = this.props.data.filter(
      state => state.name === this.props.selectedState
    );
    const total = data.reduce((total, cause) => total + cause[this.value], 0);

    this.svg
      .select('.slices')
      .datum(data)
      .selectAll('path')
      .data(this.pie)
      .enter()
      .append('path')
      .attr('fill', d => this.colorScale(d.data[this.category]))
      .attr('d', this.arc);

    const keys = this.legend
      .selectAll('.key')
      .data(data)
      .enter()
      .append('div')
      .attr('class', 'key');

    if (this.props.width > 400 && this.props.height > 250) {
      keys
        .append('div')
        .attr('class', 'symbol')
        .style('background-color', d => this.colorScale(d[this.category]));
    }

    keys
      .append('div')
      .attr(
        'class',
        this.props.width > 400 && this.props.height > 250
          ? 'textBig'
          : 'textSmall'
      )
      .style('color', d => this.colorScale(d[this.category]))
      .html(
        d =>
          `${d[this.category]}: <strong>${this.percentFormat(
            d[this.value] / total
          )}</strong>`
      );
  };

  render() {
    console.log(this.props.width, this.props.height);
    return (
      <div className="donutBox d-flex justify-content-between">
        <div>
          <svg
            width={this.props.width / 2}
            height={this.props.height}
            ref={this.donutChartRef}
          />
        </div>
        <div className="donutLegend align-self-center mt-2">
          <div className="title">Cause of Accidents</div>
        </div>
      </div>
    );
  }
}

DonutChart.propTypes = {
  width: number.isRequired,
  height: number.isRequired,
  data: arrayOf(shape).isRequired,
  selectedState: string.isRequired,
  viewBy: shape({}).isRequired
};

export default DonutChart;
