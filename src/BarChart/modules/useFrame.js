/* eslint-disable no-param-reassign */
import Konva from 'konva';

function useFrame(config) {
  const { theme } = config;

  // canvas width & height - padding
  const inner = {
    xStart: theme.padding,
    xEnd: config.width - theme.padding,
    yStart: theme.padding,
    yEnd: config.height - theme.padding,
  };

  // legend
  const legend = {
    xStart: theme.padding,
    yStart: theme.padding + theme.title.fontSize + theme.title.marginBottom,
    items: [],
  };

  config.data.forEach((dataset, i) => {
    const textWidth = Math.ceil(
      new Konva.Text({
        text: dataset.name,
        fontFamily: theme.legend.fontFamily || theme.fontFamily,
        fontSize: theme.legend.fontSize,
      }).getTextWidth(),
    );

    const marginRight =
      i === config.data.length - 1 ? 0 : theme.legend.itemMarginRight;

    let xStart = i === 0 ? legend.xStart : legend.items[i - 1].xEnd;
    let yStart = i === 0 ? legend.yStart : legend.items[i - 1].yStart;
    let xEnd =
      xStart +
      theme.legend.circle.size +
      theme.legend.circle.marginRight +
      textWidth +
      marginRight;
    let yEnd = yStart + theme.legend.fontSize + theme.legend.marginBottom;

    let xInnerStart = xStart;
    let yInnerStart = yStart;
    let xInnerEnd = xEnd - marginRight;
    let yInnerEnd = yEnd - theme.legend.marginBottom;

    if (i > 0 && xInnerEnd > inner.xEnd) {
      xStart = legend.xStart;
      yStart = yStart + theme.legend.fontSize + theme.legend.itemMarginBottom;
      xEnd =
        xStart +
        theme.legend.circle.size +
        theme.legend.circle.marginRight +
        textWidth +
        marginRight;
      yEnd = yStart + theme.legend.fontSize + theme.legend.marginBottom;

      xInnerStart = xStart;
      yInnerStart = yStart;
      xInnerEnd = xEnd - marginRight;
      yInnerEnd = yEnd - theme.legend.marginBottom;
    }

    legend.items.push({
      xStart,
      xEnd,
      yStart,
      yEnd,
      xInnerStart,
      xInnerEnd,
      yInnerStart,
      yInnerEnd,
    });
  });
  legend.yEnd = legend.items[legend.items.length - 1].yEnd;

  const header = {
    xStart: theme.padding,
    xEnd: config.width - theme.padding,
    yStart: theme.padding,
    yEnd: legend.yEnd,
  };

  // chart + axes
  const outerChart = {
    xStart: inner.xStart,
    xEnd: inner.xEnd,
    yStart: header.yEnd,
    yEnd: inner.yEnd,
  };

  const lastEntryWidths = config.data.map(dataset => {
    const lastEntry = dataset.series[dataset.series.length - 1];
    const textWidth = new Konva.Text({
      text: config.formatters.axes.y(lastEntry?.y),
      fontFamily: theme.axes.fontFamily || theme.fontFamily,
      fontSize: theme.axes.fontSize,
    }).getTextWidth();
    return Math.ceil(textWidth);
  });

  const ySize =
    theme.axes.tickSize +
    theme.axes.tickMargin +
    Math.max(...lastEntryWidths) +
    theme.axes.tickMargin;

  const xSize =
    theme.axes.tickSize + theme.axes.tickMargin + theme.axes.fontSize;

  const innerChart = {
    xStart: inner.xStart,
    xEnd: inner.xEnd - ySize,
    width: inner.xEnd - ySize - inner.xStart,
    yStart: header.yEnd,
    yEnd: inner.yEnd - xSize,
    height: inner.yEnd - xSize - header.yEnd,
  };

  const xAxis = {
    xStart: innerChart.xStart,
    xEnd: innerChart.xEnd,
    yStart: innerChart.yEnd,
    yEnd: innerChart.yEnd,
  };

  const yAxis = {
    xStart: innerChart.xEnd,
    xEnd: outerChart.xEnd,
    yStart: innerChart.yStart,
    yEnd: innerChart.yEnd,
  };

  return {
    inner,
    header,
    legend,
    outerChart,
    innerChart,
    xAxis,
    yAxis,
  };
}

export default useFrame;
