import { mix } from 'polished';

function YTick({ config, frame, y, text, fill }) {
  const bgSize = config.theme.axes.lastValueTickBgSize;

  return [
    {
      type: 'Line',
      attrs: {
        fill: mix(0.2, fill, config.theme.bgColor),
        points: [
          frame.yAxis.xStart,
          y,
          frame.yAxis.xStart + bgSize / 2,
          y - bgSize / 2,
          frame.yAxis.xStart + frame.yAxis.width,
          y - bgSize / 2,
          frame.yAxis.xStart + frame.yAxis.width,
          y + bgSize / 2,
          frame.yAxis.xStart + bgSize / 2,
          y + bgSize / 2,
          frame.yAxis.xStart,
          y,
        ],
        closed: true,
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: fill,
        strokeWidth: 1,
        points: [
          frame.yAxis.xStart,
          y,
          frame.yAxis.xStart + config.theme.axes.tickSize,
          y,
        ],
      },
    },
    {
      type: 'Text',
      attrs: {
        fontFamily: config.theme.fontFamily,
        fontStyle: config.theme.fontStyle,
        fontSize: config.theme.axes.fontSize,
        text,
        x:
          frame.yAxis.xStart +
          config.theme.axes.tickSize +
          config.theme.axes.tickMargin,
        y: y + 1,
        offsetY: config.theme.axes.fontSize / 2,
        fill,
      },
    },
  ];
}

export default YTick;
