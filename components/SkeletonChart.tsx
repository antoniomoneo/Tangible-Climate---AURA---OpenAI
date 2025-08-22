import React from 'react';
import { temperatureData } from '../data/temperatureData';

interface SkeletonChartProps {
  startYear: number;
  endYear: number;
}

const SkeletonChart: React.FC<SkeletonChartProps> = ({ startYear, endYear }) => {
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 50 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const chartData = temperatureData.filter(d => d.year >= startYear && d.year <= endYear);
  if (chartData.length === 0) {
    return <div className="text-center text-gray-500">No data available for this period.</div>;
  }

  const minAnomaly = Math.min(-0.2, ...temperatureData.map(d => d.anomaly));
  const maxAnomaly = Math.max(0.2, ...temperatureData.map(d => d.anomaly));
  const anomalyRange = maxAnomaly - minAnomaly;

  const xScale = (year: number) => 
    margin.left + ((year - startYear) / (endYear - startYear)) * innerWidth;
  
  const yScale = (anomaly: number) => 
    margin.top + innerHeight - ((anomaly - minAnomaly) / anomalyRange) * innerHeight;

  const yZero = yScale(0);

  const yearTicks = chartData.map(d => d.year).filter(year => {
    const totalYears = endYear - startYear;
    if (totalYears > 100) return year % 20 === 0;
    if (totalYears > 50) return year % 10 === 0;
    if (totalYears > 20) return year % 5 === 0;
    return true;
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full text-gray-400 font-mono animate-fadeIn" aria-label={`Temperature anomaly chart from ${startYear} to ${endYear}`}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        {/* Y-Axis Grid Lines */}
        <line x1={margin.left - 10} y1={yZero} x2={innerWidth + margin.left} y2={yZero} stroke="currentColor" strokeOpacity="0.3" strokeDasharray="4 4" />
        <text x={margin.left - 15} y={yZero} dy="0.32em" textAnchor="end" className="text-xs fill-current">0°C</text>
        
        {/* X-Axis Labels */}
        {yearTicks.map(year => (
           <g key={year} transform={`translate(${xScale(year)}, ${innerHeight + margin.top})`}>
              <text y={15} textAnchor="middle" className="text-xs fill-current">
                  {year}
              </text>
           </g>
        ))}

        {/* Data lines (spine) */}
        {chartData.slice(0, -1).map((d, i) => {
            const nextD = chartData[i + 1];
            const isWarm = d.anomaly > 0;
            return (
                <line
                    key={`line-${d.year}`}
                    x1={xScale(d.year)}
                    y1={yScale(d.anomaly)}
                    x2={xScale(nextD.year)}
                    y2={yScale(nextD.anomaly)}
                    className={isWarm ? 'stroke-amber-400' : 'stroke-cyan-400'}
                    strokeWidth="1.5"
                />
            );
        })}

        {/* Data points (vertebrae) */}
        {chartData.map(d => {
            const isWarm = d.anomaly > 0;
            return (
                <circle
                    key={`circle-${d.year}`}
                    cx={xScale(d.year)}
                    cy={yScale(d.anomaly)}
                    r="3"
                    className={isWarm ? 'fill-amber-400' : 'fill-cyan-400'}
                    stroke={isWarm ? 'stroke-amber-200' : 'stroke-cyan-200'}
                    strokeWidth="1"
                >
                  <title>{`${d.year}: ${d.anomaly.toFixed(2)}°C`}</title>
                </circle>
            );
        })}
      </g>
    </svg>
  );
};

export default SkeletonChart;
