import React, { Component } from 'react';
import { arrayOf, shape, string, number } from 'prop-types';
import * as d3 from 'd3';
import './Chart.css';

const typesInfo = [
  {
    type: 'Two Wheelers',
    icon: 'bike',
    included: ['Motor Cycle', 'Moped/Scootty']
  },
  {
    type: 'Auto Rickshaws',
    icon: 'auto',
    included: ['Auto Rickshaws']
  },
  {
    type: 'Cars',
    icon: 'car',
    included: ['Cars', 'Jeep', 'Taxis']
  },
  {
    type: 'Buses',
    icon: 'bus',
    included: ['Bus']
  },
  {
    type: 'Trucks',
    icon: 'truck',
    included: ['Truck Lorry', 'Tempo', 'Trolly', 'Tractor']
  },
  {
    type: 'Others',
    icon: 'other',
    included: ['Other Motor Vehicles']
  }
];

const colorScale = d3.scaleOrdinal([
  '#CC998C',
  '#F29279',
  '#AA8899',
  '#FF99B6',
  '#fdc171',
  '#AA9988'
]);

const margin = { top: 40, right: 20, bottom: 40, left: 60 };

class BarChart extends Component {
  componentDidMount() {
    this.initializeParameters(this.props);
    this.initializeContainer();
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

  svgRef = React.createRef();

  resetChart = props => {
    this.svg.remove();
    this.tooltipDiv.remove();
    this.initializeParameters(props);
    this.initializeContainer();
  };

  initializeParameters = props => {
    this.width = props.width - margin.left - margin.right;
    this.height = props.height - margin.top - margin.bottom;
    this.x = d3
      .scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1);
    this.y = d3.scaleLinear().rangeRound([this.height, 0]);
    this.xAxis = d3.axisBottom(this.x).tickPadding(10);
    this.yAxis = d3.axisLeft(this.y).ticks(5);
    this.value = props.viewBy.vehicleDataRef;
  };

  initializeContainer = () => {
    this.svg = d3
      .select(this.svgRef.current)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.tooltipDiv = d3
      .select('body')
      .append('div')
      .attr('class', 'iconTooltip')
      .style('opacity', 0);
  };

  renderChart = () => {
    const data = this.props.data.filter(
      d => d.name === this.props.selectedState
    );
    this.x.domain(data.map(d => d[this.props.category]));
    this.y.domain([0, d3.max(data, d => d[this.value])]);

    const xAxis = this.svg
      .append('g')
      .attr('class', 'axis axis--x')
      .attr('transform', `translate(0, ${this.height})`)
      .call(this.xAxis);

    this.svg
      .append('g')
      .attr('class', 'axis axis--y')
      .call(this.yAxis)
      .append('text')
      .attr('class', 'yAxisLabel')
      .attr('text-anchor', 'middle')
      .attr('fill', '#000000')
      .attr(
        'transform',
        `translate(${-(margin.left - 10)},${this.height / 2})rotate(-90)`
      )
      .text(this.props.viewBy.name);

    this.svg
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.x(d[this.props.category]))
      .attr('y', d => this.y(d[this.value]))
      .attr('fill', d => colorScale(d[this.props.category]))
      .attr('width', this.x.bandwidth())
      .attr('height', d => this.height - this.y(d[this.value]));

    this.svg
      .selectAll('.label')
      .data(data)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => this.x(d[this.props.category]) + this.x.bandwidth() / 2)
      .attr('y', d => this.y(d[this.value]) - 3)
      .attr('text-anchor', 'middle')
      .text(d => {
        return d3.format(',')(d[this.value]);
      });

    const tooltipDiv = this.tooltipDiv;
    const imagePath =
      process.env.NODE_ENV === 'production'
        ? '/india-road-accidents/images/'
        : '/images/';

    xAxis.selectAll('.tick').each(function(d) {
      const tick = d3.select(this);
      tick.select('text').remove();

      tick
        .append('svg:image')
        .attr('x', -9)
        .attr('y', 3)
        .attr('dy', '.35em')
        .attr('width', 32)
        .attr('height', 32)
        .attr(
          'xlink:href',
          `${imagePath}${typesInfo.find(icon => icon.type === d).icon}.png`
        )
        .on('mouseover', d => {
          tooltipDiv
            .transition()
            .duration(200)
            .style('opacity', 0.9);
          tooltipDiv
            .html(typesInfo.find(icon => icon.type === d).included.join(', '))
            .style('left', `${d3.event.pageX - 32}px`)
            .style('top', `${d3.event.pageY + 15}px`);
        })
        .on('mouseout', d => {
          tooltipDiv
            .transition()
            .duration(500)
            .style('opacity', 0);
        });
    });
  };

  render() {
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
  selectedState: string.isRequired,
  category: string.isRequired,
  viewBy: shape({}).isRequired
};

export default BarChart;
