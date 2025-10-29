import inRange from 'lodash/inRange';
import { transparentize } from 'polished';
import getCandleSize from '../modules/getCandleSize';

const renderMACD = ({
  config,
  indicatorFrame,
  indicator,
  series,
  scales,
  yScale,
}) => {
  const candleSize = getCandleSize(scales.x);

  const signalLinePoints =
    indicator.signalLineLength > 1
      ? series
          .map(entry => [scales.x(entry.i), yScale(entry.values.signal)])
          .filter(
            ([x, y]) =>
              y !== undefined &&
              inRange(x, indicatorFrame.xStart, indicatorFrame.xEnd),
          )
          .flat(1)
      : [];

  const macdLinePoints = series
    .map(entry => [scales.x(entry.i), yScale(entry.values.macd)])
    .filter(
      ([x, y]) =>
        y !== undefined &&
        inRange(x, indicatorFrame.xStart, indicatorFrame.xEnd),
    )
    .flat(1);

  const getHistogram = (entry, i) => {
    if (!entry) {
      return undefined;
    }

    if (
      entry.values.histogram &&
      Math.abs(entry.values.histogram) !== Infinity
    ) {
      return entry.values.histogram;
    }

    // when histogram is undefined or Infinity, return macd
    // for case when signalLineLength is 1 or 0
    if (
      !entry.values.histogram ||
      Math.abs(entry.values.histogram) === Infinity
    ) {
      if (i >= indicator.signalLineLength) {
        return entry.values.macd;
      }
    }
    return undefined;
  };

  const histogramBars = series
    .map((entry, i) => {
      const value = getHistogram(entry, i);
      const prevValue = getHistogram(series[i - 1], i - 1);

      let color;
      if (value > 0) {
        color = config.theme.theme.green;
        if (prevValue !== undefined) {
          color =
            value > prevValue
              ? config.theme.theme.green
              : transparentize(0.25, config.theme.theme.green);
        }
      } else {
        color = config.theme.theme.red;
        if (prevValue !== undefined) {
          color =
            value < prevValue
              ? config.theme.theme.red
              : transparentize(0.25, config.theme.theme.red);
        }
      }

      return [scales.x(entry.i), yScale(value), color];
    })
    .filter(
      ([x, y]) =>
        y !== undefined &&
        inRange(x, indicatorFrame.xStart, indicatorFrame.xEnd),
    );

  // const histogramThresholdBars = series
  //   .map((entry, i) => {
  //     const value = entry.values.histogram;
  //     const color = config.theme.theme.fill300;

  //     const yScaleValue =
  //       value > 0
  //         ? Math.min(value, indicator.signalThreshold)
  //         : Math.max(value, -indicator.signalThreshold);

  //     return [scales.x(entry.i), yScale(yScaleValue), color];
  //   })
  //   .filter(
  //     ([x, y]) =>
  //       y !== undefined &&
  //       inRange(x, indicatorFrame.xStart, indicatorFrame.xEnd),
  //   );

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
    ...histogramBars.map(([x, y, color]) => ({
      type: 'Rect',
      attrs: {
        x,
        y: Math.min(y, yScale(0)),
        width: Math.max(candleSize.width, 0.5),
        height: Math.abs(y - yScale(0)),
        fill: color,
        perfectDrawEnabled: false,
        listening: false,
      },
    })),
    // ...histogramThresholdBars.map(([x, y, color]) => ({
    //   type: 'Rect',
    //   attrs: {
    //     x,
    //     y: Math.min(y, yScale(0)),
    //     width: candleSize.width,
    //     height: Math.abs(y - yScale(0)),
    //     fill: color,
    //     perfectDrawEnabled: false,
    //     listening: false,
    //   },
    // })),
    {
      type: 'Line',
      attrs: {
        stroke: indicator.macdLineColor,
        strokeWidth: indicator.thickness,
        points: macdLinePoints,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: indicator.signalLineColor,
        strokeWidth: indicator.thickness,
        points: signalLinePoints,
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

export default renderMACD;
