import inRange from 'lodash/inRange';
import { transparentize } from 'polished';

const renderBB = ({ indicator, config, frame, series, scales }) => {
  const upperPoints = series
    .map(entry => [scales.x(entry.i), scales.y(entry.values.upper)])
    .filter(
      ([x, y]) =>
        y !== undefined &&
        inRange(x, frame.mainChart.xStart, frame.mainChart.xEnd),
    )
    .flat(1);

  const middlePoints = series
    .map(entry => [scales.x(entry.i), scales.y(entry.values.middle)])
    .filter(
      ([x, y]) =>
        y !== undefined &&
        inRange(x, frame.mainChart.xStart, frame.mainChart.xEnd),
    )
    .flat(1);

  const lowerPoints = series
    .map(entry => [scales.x(entry.i), scales.y(entry.values.lower)])
    .filter(
      ([x, y]) =>
        y !== undefined &&
        inRange(x, frame.mainChart.xStart, frame.mainChart.xEnd),
    );

  return [
    {
      type: 'Line',
      attrs: {
        fill: transparentize(0.5, config.theme.theme.backgroundDarkest),
        points: [upperPoints, lowerPoints.reverse()].flat(2),
        perfectDrawEnabled: false,
        listening: false,
        closed: true,
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.theme.red,
        strokeWidth: indicator.thickness,
        points: upperPoints,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.theme.blue,
        strokeWidth: indicator.thickness,
        points: middlePoints,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.theme.green,
        strokeWidth: indicator.thickness,
        points: lowerPoints.flat(1),
        perfectDrawEnabled: false,
        listening: false,
      },
    },
  ];
};

export default renderBB;
