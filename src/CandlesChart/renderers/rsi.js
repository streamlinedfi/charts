import inRange from 'lodash/inRange';

const renderRSI = ({
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
      type: 'Rect',
      attrs: {
        x: indicatorFrame.xStart,
        y: yScale(indicator.upperLine),
        width: indicatorFrame.xEnd - indicatorFrame.xStart,
        height: yScale(indicator.lowerLine) - yScale(indicator.upperLine),
        fill: config.theme.theme.backgroundDarkest,
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.theme.fill400,
        strokeWidth: 1,
        dash: [3, 4],
        points: [
          indicatorFrame.xStart,
          yScale(indicator.upperLine),
          indicatorFrame.xEnd,
          yScale(indicator.upperLine),
        ],
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.theme.fill300,
        strokeWidth: 1,
        dash: [3, 4],
        points: [
          indicatorFrame.xStart,
          yScale(50),
          indicatorFrame.xEnd,
          yScale(50),
        ],
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.theme.fill400,
        strokeWidth: 1,
        dash: [3, 4],
        points: [
          indicatorFrame.xStart,
          yScale(indicator.lowerLine),
          indicatorFrame.xEnd,
          yScale(indicator.lowerLine),
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

export default renderRSI;
