import React, { Component } from 'react';
import * as d3 from 'd3';

const iconsList = [
  {
    type: 'Two Wheelers',
    icon: 'bike'
  },
  {
    type: 'Auto Rickshaws',
    icon: 'auto'
  },
  {
    type: 'Cars',
    icon: 'car'
  },
  {
    type: 'Buses',
    icon: 'bus'
  },
  {
    type: 'Trucks',
    icon: 'truck'
  },
  {
    type: 'Others',
    icon: 'other'
  }
];

class BarChart extends Component {
  componentDidMount() {
    console.log(this.props.data);
    this.initializeContainer();
    this.renderChart(this.props.data);
  }

  svgRef = React.createRef();

  initializeContainer = () => {
    this.svg = d3.select(this.svgRef.current);
    this.margin = { top: 20, right: 20, bottom: 30, left: 40 };
    this.width = +this.svg.attr('width') - this.margin.left - this.margin.right;
    this.height =
      +this.svg.attr('height') - this.margin.top - this.margin.bottom;
    this.x = d3
      .scaleBand()
      .rangeRound([0, this.width])
      .padding(0.1);
    this.y = d3.scaleLinear().rangeRound([this.height, 0]);
    this.g = this.svg
      .append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);
  };

  renderChart = data => {
    this.x.domain(data.map(d => d.vehicleType));
    this.y.domain([0, d3.max(data, d => d.accidentsTotal)]);

    this.xAxis = d3.axisBottom(this.x).tickPadding(10);

    const xAxis = this.g
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

    this.g
      .append('g')
      .attr('class', 'axis axis--y')
      .call(d3.axisLeft(this.y).ticks(5))
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 6)
      .attr('dy', '0.71em')
      .attr('text-anchor', 'end')
      .text('accidentsTotal');

    this.g
      .selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => this.x(d.vehicleType))
      .attr('y', d => this.y(d.accidentsTotal))
      .attr('width', this.x.bandwidth())
      .attr('height', d => this.height - this.y(d.accidentsTotal));
  };

  render() {
    return (
      <div>
        <svg width={400} height={400} ref={this.svgRef} />
      </div>
    );
  }
}

export default BarChart;
