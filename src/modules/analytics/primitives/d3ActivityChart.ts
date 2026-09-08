import * as d3 from 'd3';
import { WeeklyCommitActivity } from '../logic/types';

export function renderWeeklyActivityChart(
  container: SVGSVGElement,
  data: WeeklyCommitActivity[],
  width: number,
  height: number
) {
  const svg = d3.select(container);
  svg.selectAll('*').remove();

  if (!data || data.length === 0) return;

  const displayData = data.slice(-20);
  const margin = { top: 15, right: 15, bottom: 25, left: 35 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  const x = d3
    .scaleBand()
    .domain(displayData.map((d) => d.weekLabel))
    .range([0, innerWidth])
    .padding(0.25);

  const maxVal = d3.max(displayData, (d) => d.total) || 5;
  const y = d3
    .scaleLinear()
    .domain([0, Math.max(maxVal, 4)])
    .nice()
    .range([innerHeight, 0]);

  // Gradient
  const defs = svg.append('defs');
  const gradient = defs
    .append('linearGradient')
    .attr('id', 'activity-gradient')
    .attr('x1', '0%')
    .attr('y1', '0%')
    .attr('x2', '0%')
    .attr('y2', '100%');

  gradient.append('stop').attr('offset', '0%').attr('stop-color', '#8b5cf6').attr('stop-opacity', 0.9);
  gradient.append('stop').attr('offset', '100%').attr('stop-color', '#6366f1').attr('stop-opacity', 0.6);

  // Grid lines
  g.append('g')
    .attr('class', 'grid')
    .call(
      d3
        .axisLeft(y)
        .ticks(4)
        .tickSize(-innerWidth)
        .tickFormat(() => '')
    )
    .selectAll('line')
    .attr('stroke', '#f3f4f6')
    .attr('stroke-dasharray', '2,2');

  // Bars
  g.selectAll('.bar')
    .data(displayData)
    .enter()
    .append('rect')
    .attr('class', 'bar')
    .attr('x', (d) => x(d.weekLabel) || 0)
    .attr('y', (d) => y(d.total))
    .attr('width', x.bandwidth())
    .attr('height', (d) => Math.max(0, innerHeight - y(d.total)))
    .attr('fill', 'url(#activity-gradient)')
    .attr('rx', 3);

  // Trend line
  const line = d3
    .line<WeeklyCommitActivity>()
    .x((d) => (x(d.weekLabel) || 0) + x.bandwidth() / 2)
    .y((d) => y(d.total))
    .curve(d3.curveMonotoneX);

  g.append('path')
    .datum(displayData)
    .attr('fill', 'none')
    .attr('stroke', '#4f46e5')
    .attr('stroke-width', 2)
    .attr('d', line);

  // X Axis
  g.append('g')
    .attr('transform', `translate(0,${innerHeight})`)
    .call(
      d3
        .axisBottom(x)
        .tickValues(displayData.filter((_, i) => i % 3 === 0).map((d) => d.weekLabel))
    )
    .selectAll('text')
    .style('font-size', '9px')
    .style('fill', '#9ca3af');

  // Y Axis
  g.append('g')
    .call(d3.axisLeft(y).ticks(4))
    .selectAll('text')
    .style('font-size', '9px')
    .style('fill', '#9ca3af');

  svg.selectAll('.domain').attr('stroke', '#e5e7eb');
}
