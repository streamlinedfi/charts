import inRange from 'lodash/inRange';

const renderROC = ({
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
    // Zero line
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.indicators.roc.zeroLineColor,
        strokeWidth: 1,
        dash: [3, 4],
        points: [
          indicatorFrame.xStart,
          yScale(0),
          indicatorFrame.xEnd,
          yScale(0),
        ],
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    // ROC line
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
    // Y axis border
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.axes.lineColor,
        strokeWidth: 1,
        points: [
          indicatorFrame.xEnd,
          indicatorFrame.yStart,
          indicatorFrame.xEnd,
          indicatorFrame.yEnd,
        ],
        perfectDrawEnabled: false,
        listening: false,
      },
    },
  ];
};

export default renderROC;
