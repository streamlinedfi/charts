function renderTick({ frame, config, value, y, showLine = true }) {
  const tick = [
    config.theme.grid.showY &&
      showLine && {
        type: 'Line',
        attrs: {
          points: [frame.mainChart.xStart, y, frame.mainChart.xEnd, y],
          stroke: config.theme.grid.lineColor,
          strokeWidth: 1,
          perfectDrawEnabled: false,
          listening: false,
        },
      },
    {
      type: 'Line',
      attrs: {
        points: [
          frame.yAxis.xStart,
          y,
          frame.yAxis.xStart + config.theme.axes.tickSize,
          y,
        ],
        stroke: config.theme.axes.tickColor,
        strokeWidth: 1,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Text',
      attrs: {
        fontFamily: config.theme.fontFamily,
        fontStyle: config.theme.fontStyle,
        fontSize: config.theme.axes.fontSize,
        text: config.formatters.axes.y(value, config.decimals),
        fill: config.theme.axes.color,
        x:
          frame.yAxis.xStart +
          config.theme.axes.tickSize +
          config.theme.axes.tickMargin,
        y: y + 1,
        offsetY: config.theme.axes.fontSize / 2,
        perfectDrawEnabled: false,
      },
    },
  ];

  return tick;
}

export default renderTick;
