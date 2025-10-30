export default function renderDrawingToolbar({ config, frame, isSelected }) {
  const width = 256;

  const xStart = config.width / 2 - width / 2;
  const yStart = frame.header.yEnd;

  const visible = !!isSelected;

  const circleSize = 16;
  const closeSize = 24;
  const barHeight = 34;

  const closeX =
    xStart +
    circleSize / 2 +
    (barHeight - circleSize) / 2 +
    (circleSize + 8) * colors.length +
    12;

  const closeY = yStart + closeSize / 2 + (barHeight - closeSize) / 2;

  return [
    {
      type: 'Rect',
      attrs: {
        x: xStart,
        y: yStart,
        width,
        height: barHeight,
        stroke: config.theme.drawingToolbar.borderColor,
        strokeWidth: 1,
        cornerRadius: 17,
        fill: config.theme.drawingToolbar.bgColor,
        visible,
      },
    },
    ...config.theme.drawingToolbar.colors.map((color, i) => ({
      type: 'Circle',
      attrs: {
        x:
          xStart +
          circleSize / 2 +
          (barHeight - circleSize) / 2 +
          (circleSize + 8) * i,
        y: yStart + circleSize / 2 + (barHeight - circleSize) / 2,
        width: circleSize,
        height: circleSize,
        radius: circleSize / 2,
        fill: i === 0 ? color : undefined,
        stroke: color,
        strokeWidth: 1.5,
        visible,
      },
    })),
    {
      type: 'Circle',
      attrs: {
        x: closeX,
        y: closeY,
        width: closeSize,
        height: closeSize,
        radius: closeSize / 2,
        fill: config.theme.drawingToolbar.closeBgColor,
        stroke: config.theme.drawingToolbar.closeBgColor,
        strokeWidth: 1.5,
        visible,
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.drawingToolbar.closeColor,
        strokeWidth: 1.5,
        points: [closeX - 5, closeY - 5, closeX + 5, closeY + 5],
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.drawingToolbar.closeColor,
        strokeWidth: 1.5,
        points: [closeX + 5, closeY - 5, closeX - 5, closeY + 5],
      },
    },
  ];
}
