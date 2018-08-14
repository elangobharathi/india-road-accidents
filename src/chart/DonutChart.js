import React, { Component } from 'react';
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

  resetChart = props => {
    this.svg.remove();
    this.legend.selectAll('.key').remove();
    this.initializeParameters(props);
  };

  initializeParameters = currentProps => {
    const svgRef = d3.select(this.donutChartRef.current);
    const width = currentProps.width / 2;
    const height = currentProps.height;
    console.log('Initialize params', width, height);
    this.radius = Math.min(width, height) / 2;
    const margin = { top: 10, right: 0, bottom: 10, left: 0 };
    this.color = d3.scaleOrdinal([
      '#800026',
      '#268000',
      '#004d80',
      '#FC4E2A',
      '#806d00',
      '#FEB24C',
      '#800066',
      '#CC6EAE'
    ]);
    this.variable = currentProps.viewBy.vehicleDataRef;
    this.category = 'cause';
    const padAngle = 0.015;
    const floatFormat = d3.format('.4r');
    const cornerRadius = 3;

    this.pie = d3
      .pie()
      .value(d => floatFormat(d[this.variable]))
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
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');

    this.svg.append('g').attr('class', 'slices');
  };

  renderChart = () => {
    const data = this.props.data.filter(
      state => state.name === this.props.selectedState
    );
    const total = data.reduce(
      (total, cause) => total + cause[this.variable],
      0
    );

    this.svg
      .select('.slices')
      .datum(data)
      .selectAll('path')
      .data(this.pie)
      .enter()
      .append('path')
      .attr('fill', d => this.color(d.data[this.category]))
      .attr('d', this.arc);

    const percentFormat = d3.format(',.2%');

    this.legend = d3.select('#legend');
    //   .append('div')
    //   .attr('class', 'legend')
    //   .style('margin-top', '30px');

    const keys = this.legend
      .selectAll('.key')
      .data(data)
      .enter()
      .append('div')
      .attr('class', 'key')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('margin-right', '20px')
      .style('margin-bottom', '5px');

    console.log(this.props.width, this.props.height);

    if (this.props.width > 400 && this.props.height > 200) {
      keys
        .append('div')
        .attr('class', 'symbol')
        .style('height', '15px')
        .style('width', '15px')
        .style('margin', '5px 5px')
        .style('background-color', (d, i) => this.color(i));
    }

    keys
      .append('div')
      .attr(
        'class',
        this.props.width > 400 && this.props.height > 200
          ? 'legendTextBig'
          : 'legendTextSmall'
      )
      .style('color', (d, i) => this.color(i))
      .html(
        d =>
          `${d[this.category]}: <strong>${percentFormat(
            d[this.variable] / total
          )}</strong>`
      );

    keys.exit().remove();
  };

  donutChartRef = React.createRef();
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
        <div id="legend" className="donutLegend align-self-center mt-2">
          <div className="legendTitle">Cause of Accidents</div>
        </div>
      </div>
    );
  }
}

export default DonutChart;
