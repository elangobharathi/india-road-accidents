import React, { Component } from 'react';
import { arrayOf, shape, string, number } from 'prop-types';
import * as d3 from 'd3';

const iconsList = [
  {
    type: 'Two Wheelers',
    color: '#FF99B6',
    icon: 'bike'
  },
  {
    type: 'Auto Rickshaws',
    color: '#F29279',
    icon: 'auto'
  },
  {
    type: 'Cars',
    color: '#AA8899',
    icon: 'car'
  },
  {
    type: 'Buses',
    color: '#7F4C3F',
    icon: 'bus'
  },
  {
    type: 'Trucks',
    color: '#fdc171',
    icon: 'truck'
  },
  {
    type: 'Others',
    color: '#AA9988',
    icon: 'other'
  }
];

class BarChart extends Component {
  componentDidMount() {
    this.initializeParameters(this.props);
    this.initializeContainer();
    this.renderChart();
  }

  shouldComponentUpdate(nextProps) {
    let shoudUpdate = false;
    console.log(nextProps.data);
    if (
      this.props.width !== nextProps.width ||
      this.props.height !== nextProps.height ||
      this.props.selectedState !== nextProps.selectedState
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
    this.initializeParameters(props);
    this.initializeContainer();
  };

  svgRef = React.createRef();
  formatTicksTok = d3.formatPrefix('.0', 10e2);

  initializeParameters = props => {
    this.margin = { top: 20, right: 20, bottom: 40, left: 40 };
    this.width = props.width - this.margin.left - this.margin.right;
    this.height = props.height - this.margin.top - this.margin.bottom;
    this.x = d3
      .scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1);
    this.y = d3.scaleLinear().rangeRound([this.height, 0]);
    this.xAxis = d3.axisBottom(this.x).tickPadding(10);
    this.yAxis = d3
      .axisLeft(this.y)
      .ticks(5)
      .tickFormat(this.formatTicksTok);
  };

  initializeContainer = () => {
    this.svg = d3
      .select(this.svgRef.current)
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  };

  renderChart = () => {
    const data = this.props.data.filter(
      d => d.name === this.props.selectedState
    );
    this.x.domain(data.map(d => d.vehicleType));
    this.y.domain([0, d3.max(data, d => d.accidentsTotal)]);

    const xAxis = this.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.height})`)
      .call(this.xAxis);

    xAxis.selectAll('.tick').each(function(d) {
      const p = d3.select(this);
      p.select('text').remove();
      p.append('svg:image')
        .attr('x', -9)
        .attr('y', 3)
        .attr('dy', '.35em')
        .attr('width', 32)
        .attr('height', 32)
        .attr(
          'xlink:href',
          `/images/${iconsList.find(icon => icon.type === d).icon}.png`
        );
    });

    this.svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis)
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('accidentsTotal');

    this.svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.x(d.vehicleType))
      .attr('y', d => this.y(d.accidentsTotal))
      .attr(
        'fill',
        d => iconsList.find(icon => icon.type === d.vehicleType).color
      )
      .attr('width', this.x.bandwidth())
      .attr('height', d => this.height - this.y(d.accidentsTotal));
  };

  render() {
    console.log(this.props.width, this.props.height);
    return (
      <svg
        width={this.props.width}
        height={this.props.height}
        ref={this.svgRef}
      />
    );
  }
}

BarChart.propTypes = {
  width: number.isRequired,
  height: number.isRequired,
  data: arrayOf(shape).isRequired,
  selectedState: string.isRequired
};

export default BarChart;
