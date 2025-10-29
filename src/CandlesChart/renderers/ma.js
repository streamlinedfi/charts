import inRange from 'lodash/inRange';

const renderMA = ({ indicator, frame, series, scales }) => {
  const points = series
    .map(entry => [scales.x(entry.i), scales.y(entry.value)])
    .filter(
      ([x, y]) =>
        y !== undefined &&
        inRange(x, frame.mainChart.xStart, frame.mainChart.xEnd),
    )
    .flat(1);

  return [
    {
      type: 'Line',
      attrs: {
        stroke: indicator.color,
        strokeWidth: indicator.thickness,
        points,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
  ];
};

export default renderMA;
