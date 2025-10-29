/* eslint-disable no-param-reassign */
import Konva from 'konva';
import last from 'lodash/last';
import sortBy from 'lodash/sortBy';
import sum from 'lodash/sum';
import { useMemo } from 'react';

const { stringify: jstr } = JSON;

function withDimensions(el) {
  el.width = el.xEnd - el.xStart;
  el.height = el.yEnd - el.yStart;
  return el;
}

function getFrame(config, data) {
  const { theme } = config;

  if (!(config.width > 0)) {
    return null;
  }

  // canvas width & height - padding
  const bodyInner = withDimensions({
    yStart: Array.isArray(theme.padding) ? theme.padding[0] : theme.padding,
    xEnd:
      config.width -
      (Array.isArray(theme.padding) ? theme.padding[1] : theme.padding),
    yEnd:
      config.height -
      (Array.isArray(theme.padding) ? theme.padding[2] : theme.padding),
    xStart: Array.isArray(theme.padding) ? theme.padding[3] : theme.padding,
  });

  const headerHeight = 48;
  const header = withDimensions({
    xStart: bodyInner.xStart,
    xEnd: bodyInner.xEnd,
    yStart: bodyInner.yStart,
    yEnd: bodyInner.yStart + headerHeight,
  });

  let lastEntryWidth = 0;
  if (data.series) {
    const lastClose = last(data.series).close;
    const lastCloseChars = String(lastClose).length;
    const textWidth = new Konva.Text({
      text: config.formatters.axes.y(
        Array(lastCloseChars)
          .fill('0')
          .join(''),
      ),
      fontFamily: theme.axes.fontFamily || theme.fontFamily,
      fontSize: theme.axes.fontSize,
    }).getTextWidth();

    // ceil by 5px
    lastEntryWidth = Math.ceil(textWidth / 5) * 5;
  }

  const ySize =
    theme.axes.tickSize +
    theme.axes.tickMargin +
    lastEntryWidth +
    theme.axes.tickMargin * 2;

  const xSize =
    theme.axes.tickSize + theme.axes.tickMargin + theme.axes.fontSize;

  const mainInner = withDimensions({
    xStart: bodyInner.xStart,
    xEnd: bodyInner.xEnd - ySize,
    yStart: header.yEnd,
    yEnd: bodyInner.yEnd,
  });

  const indicatorsWithWindows = sortBy(
    config.indicators.windows.filter(indicator => indicator.active),
    'order',
  );

  const indicatorWindows = indicatorsWithWindows
    .reduce((windows, indicator) => {
      const yStart = sum(
        indicatorsWithWindows
          .filter(ic => !windows.some(w => w.indicator === ic.indicator))
          .map(ic => ic.height || ic.defaultHeight),
      );

      return [
        ...windows,
        {
          indicator: indicator.indicator,
          xStart: mainInner.xStart,
          xEnd: mainInner.xEnd,
          yStart: mainInner.yEnd - xSize - yStart,
          yEnd:
            mainInner.yEnd -
            xSize -
            yStart +
            (indicator.height || indicator.defaultHeight),
        },
      ];
    }, [])
    .map(withDimensions);

  const mainChart = withDimensions({
    xStart: mainInner.xStart,
    xEnd: mainInner.xEnd,
    yStart: header.yEnd,
    yEnd: indicatorWindows.length
      ? indicatorWindows[0].yStart
      : mainInner.yEnd - xSize,
  });

  const xAxis = withDimensions({
    xStart: mainChart.xStart,
    xEnd: mainChart.xEnd,
    yStart: indicatorWindows.length
      ? last(indicatorWindows).yEnd
      : mainChart.yEnd,
    yEnd: bodyInner.yEnd,
  });

  mainInner.yEnd = xAxis.yStart;

  const yAxis = withDimensions({
    xStart: mainChart.xEnd,
    xEnd: bodyInner.xEnd,
    yStart: mainChart.yStart,
    yEnd: mainChart.yEnd,
  });

  return {
    bodyInner,
    header,
    mainInner,
    mainChart,
    indicatorWindows,
    xAxis,
    yAxis,
  };
}

function useFrame(config, data) {
  const frame = useMemo(() => getFrame(config, data), [
    config.width,
    config.height,
    jstr(config.indicators.windows),
    data.seriesId,
  ]);

  return frame;
}

export default useFrame;
