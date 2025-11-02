import maxBy from 'lodash/maxBy';
import { scaleLinear, scaleBand } from 'd3-scale';

export default function useScales(frame, config) {
  if (config.sharedScale) {
    const xScale = scaleBand()
      .domain(
        maxBy(config.data, data => data.series.length).series.map(({ x }) => x),
      )
      .range([frame.innerChart.xStart, frame.innerChart.xEnd])
      .paddingInner(config.theme.axes.xInnerSpacingBarMultiplier)
      .paddingOuter(config.theme.axes.xOuterSpacingBarMultiplier);

    const ySeries = config.data
      .map(({ series }) => series.map(({ y }) => y))
      .flat(1);

    const yScale = scaleLinear()
      .domain([Math.min(...ySeries, 0), Math.max(...ySeries, 0)])
      .range([frame.innerChart.yEnd, frame.innerChart.yStart])
      .nice();

    return [
      {
        x: xScale,
        y: yScale,
      },
    ];
  }

  const scales = config.data.map(({ series }) => {
    const xScale = scaleBand()
      .domain(series.map(({ x }) => x))
      .range([frame.innerChart.xStart, frame.innerChart.xEnd])
      .paddingInner(config.theme.axes.xInnerSpacingBarMultiplier)
      .paddingOuter(config.theme.axes.xOuterSpacingBarMultiplier);

    const ySeries = series.map(({ y }) => y);
    const yScale = scaleLinear()
      .domain([Math.min(0, ...ySeries), Math.max(0, ...ySeries)])
      .range([frame.innerChart.yEnd, frame.innerChart.yStart])
      .nice();

    return {
      x: xScale,
      y: yScale,
    };
  });

  return scales;
}
