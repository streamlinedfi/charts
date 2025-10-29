export const minCandleMargin = window.devicePixelRatio > 1 ? 0.5 : 0;

export default function renderCandle({
  stepWidth,
  x,
  open,
  high,
  low,
  close,
  color,
  minWidth = 0,
}) {
  let margin = minCandleMargin;
  let wickWidth = 1;
  if (stepWidth > 10) {
    wickWidth = 2;
    margin = 3;
  } else if (stepWidth > 5) {
    wickWidth = 1.5;
    margin = 2;
  } else if (stepWidth > 2.5) {
    margin = 1;
  }
  const candleWidth = Math.max(stepWidth - margin, minWidth);
  const y = Math.min(open, close);
  const height = Math.max(wickWidth, Math.abs(close - open));

  return [
    {
      type: 'Line',
      attrs: {
        points: [
          x + margin / 2 + candleWidth / 2,
          high,
          x + margin / 2 + candleWidth / 2,
          low,
        ],
        stroke: color,
        strokeWidth: wickWidth,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Rect',
      attrs: {
        x: x + margin / 2,
        y,
        width: candleWidth,
        height,
        fill: color,
        perfectDrawEnabled: false,
        listening: false,
        visible: candleWidth >= 1,
      },
    },
  ];
}
