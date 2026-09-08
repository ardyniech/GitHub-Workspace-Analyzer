import * as d3 from 'd3';
import { IssuePriorityItem } from '../logic/priorityTypes';

export function renderPriorityMatrixChart(
  container: SVGSVGElement,
  items: IssuePriorityItem[],
  width: number,
  height: number,
  onSelectItem?: (item: IssuePriorityItem) => void
) {
  const svg = d3.select(container);
  svg.selectAll('*').remove();

  const margin = { top: 25, right: 25, bottom: 35, left: 35 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  // Scales: X = Impact (1-10), Y = Urgency (1-10)
  const xScale = d3.scaleLinear().domain([0, 10]).range([0, innerWidth]);
  const yScale = d3.scaleLinear().domain([0, 10]).range([innerHeight, 0]);

  // Quadrant backgrounds
  const midX = xScale(5);
  const midY = yScale(5);

  // Quadrant 1 (Top-Right): Major Projects (High Urgency, High Impact)
  g.append('rect').attr('x', midX).attr('y', 0).attr('width', innerWidth - midX).attr('height', midY).attr('fill', '#fef2f2').attr('opacity', 0.6);
  // Quadrant 2 (Bottom-Right): Quick Wins (Low Urgency, High Impact)
  g.append('rect').attr('x', midX).attr('y', midY).attr('width', innerWidth - midX).attr('height', innerHeight - midY).attr('fill', '#f0fdf4').attr('opacity', 0.6);
  // Quadrant 3 (Top-Left): Thankless Tasks (High Urgency, Low Impact)
  g.append('rect').attr('x', 0).attr('y', 0).attr('width', midX).attr('height', midY).attr('fill', '#fffbeb').attr('opacity', 0.6);
  // Quadrant 4 (Bottom-Left): Fill-ins (Low Urgency, Low Impact)
  g.append('rect').attr('x', 0).attr('y', midY).attr('width', midX).attr('height', innerHeight - midY).attr('fill', '#f4f4f5').attr('opacity', 0.6);

  // Midpoint Dividers
  g.append('line').attr('x1', midX).attr('x2', midX).attr('y1', 0).attr('y2', innerHeight).attr('stroke', '#cbd5e1').attr('stroke-dasharray', '3,3');
  g.append('line').attr('x1', 0).attr('x2', innerWidth).attr('y1', midY).attr('y2', midY).attr('stroke', '#cbd5e1').attr('stroke-dasharray', '3,3');

  // Quadrant Labels
  const labelStyle = 'font-size: 9.5px; font-weight: 700; fill: #64748b; text-anchor: middle;';
  g.append('text').attr('x', (midX + innerWidth) / 2).attr('y', 14).attr('style', labelStyle).text('🔥 Major Projects');
  g.append('text').attr('x', (midX + innerWidth) / 2).attr('y', innerHeight - 8).attr('style', labelStyle).text('⚡ Quick Wins');
  g.append('text').attr('x', midX / 2).attr('y', 14).attr('style', labelStyle).text('⚠️ Thankless Tasks');
  g.append('text').attr('x', midX / 2).attr('y', innerHeight - 8).attr('style', labelStyle).text('📋 Fill-ins');

  // Axes
  g.append('g').attr('transform', `translate(0,${innerHeight})`).call(d3.axisBottom(xScale).ticks(5)).attr('color', '#94a3b8').selectAll('text').attr('font-size', '8.5px');
  g.append('g').call(d3.axisLeft(yScale).ticks(5)).attr('color', '#94a3b8').selectAll('text').attr('font-size', '8.5px');

  // Axis Titles
  g.append('text').attr('x', innerWidth / 2).attr('y', innerHeight + 28).attr('text-anchor', 'middle').attr('font-size', '9px').attr('fill', '#475569').attr('font-weight', '600').text('Dampak Fitur (Impact) →');
  g.append('text').attr('transform', 'rotate(-90)').attr('x', -innerHeight / 2).attr('y', -24).attr('text-anchor', 'middle').attr('font-size', '9px').attr('fill', '#475569').attr('font-weight', '600').text('Tingkat Urgensi →');

  // Render Data Points
  const colorMap: Record<string, string> = {
    'Major Projects': '#ef4444',
    'Quick Wins': '#10b981',
    'Thankless Tasks': '#f59e0b',
    'Fill-ins': '#6b7280',
  };

  const dots = g.selectAll('.dot').data(items).enter().append('g').attr('class', 'dot').style('cursor', 'pointer');

  dots.append('circle')
    .attr('cx', (d) => xScale(d.impact) + (Math.random() * 8 - 4))
    .attr('cy', (d) => yScale(d.urgency) + (Math.random() * 8 - 4))
    .attr('r', (d) => (d.state === 'open' ? 5.5 : 4))
    .attr('fill', (d) => colorMap[d.quadrant] || '#6366f1')
    .attr('stroke', '#ffffff')
    .attr('stroke-width', 1.5)
    .attr('opacity', (d) => (d.state === 'open' ? 0.9 : 0.4))
    .on('click', (_, d) => onSelectItem?.(d));

  dots.append('title').text((d) => `#${d.number}: ${d.title}\nUrgensi: ${d.urgency}/10, Dampak: ${d.impact}/10\nKuadran: ${d.quadrant}`);
}
