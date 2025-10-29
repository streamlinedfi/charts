import React from 'react';
import { Line, Rect } from './konva';
import useContext from '../modules/useContext';

export default function Candle({ x, open, high, low, close, stepWidth }) {
  const { config, frame } = useContext();
  const color =
    close <= open ? config.theme.candleUpColor : config.theme.candleDownColor;

  let margin = 0;
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
  const candleWidth = stepWidth - margin;

  const y = Math.min(open, close);
  const height = Math.max(wickWidth, Math.abs(close - open));
  // const candleYStart = Math.max(y, frame.mainChart.yStart);
  // const candleYEnd = Math.min(y + height, frame.mainChart.yEnd);
  // const candleHeight = candleYEnd - candleYStart;

  // const wickYStart = Math.max(high, frame.mainChart.yStart);
  // const wickYEnd = Math.min(low, frame.mainChart.yEnd);
  // const wickHeight = wickYEnd - wickYStart;

  // if (candleHeight <= 0 && wickHeight <= 0) {
  //   return null;
  // }

  return (
    <>
      {low - high > 0 && (
        <Line
          points={[x, high, x, low]}
          stroke={color}
          strokeWidth={wickWidth}
          // transformsEnabled="none"
          // perfectDrawEnabled={false}
          // listening={false}
        />
      )}
      {height > 0 && (
        <Rect
          // transformsEnabled="position"
          // perfectDrawEnabled={false}
          // listening={false}
          x={x - candleWidth / 2}
          y={y}
          width={candleWidth}
          height={height}
          fill={color}
        />
      )}
      {/* {wickHeight > 0 && (
        <Line
          points={[x, wickYStart, x, wickYEnd]}
          stroke={color}
          strokeWidth={wickWidth}
          // transformsEnabled="none"
          // perfectDrawEnabled={false}
          // listening={false}
        />
      )}
      {candleHeight > 0 && (
        <Rect
          // transformsEnabled="position"
          // perfectDrawEnabled={false}
          // listening={false}
          x={x - candleWidth / 2}
          y={candleYStart}
          width={candleWidth}
          height={candleHeight}
          fill={color}
        />
      )} */}
    </>
  );
}
