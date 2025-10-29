import inRange from 'lodash/inRange';

const renderATR = ({
  config,
  indicatorFrame,
  indicator,
  series,
  scales,
  yScale,
}) => {
  const points = series
    .map(entry => [scales.x(entry.i), yScale(entry.value)])
    .filter(
      ([x, y]) =>
        y !== undefined &&
        inRange(x, indicatorFrame.xStart, indicatorFrame.xEnd),
    )
    .flat(1);

  return [
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.indicatorWindow.splitLineColor,
        strokeWidth: config.theme.indicatorWindow.splitLineWidth,
        points: [
          indicatorFrame.xStart,
          indicatorFrame.yStart,
          indicatorFrame.xEnd,
          indicatorFrame.yStart,
        ],
        perfectDrawEnabled: false,
        listening: false,
      },
    },
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

export default renderATR;
