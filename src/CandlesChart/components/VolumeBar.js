import React, { useState, useEffect } from 'react';
import { Line, Rect } from './konva';
import { transparentize, darken } from 'polished';
import useContext from '../modules/useContext';

export default function VolumeBar({ x, volume, height, direction, stepWidth }) {
  const { config, frame, on } = useContext();
  const [xOffset, setXOffset] = useState(0);
  const color =
    direction === 'up'
      ? config.theme.candleUpColor
      : config.theme.candleDownColor;

  let margin = 0;
  if (stepWidth > 10) {
    margin = 3;
  } else if (stepWidth > 5) {
    margin = 2;
  } else if (stepWidth > 2.5) {
    margin = 1;
  }
  const candleWidth = Math.max(stepWidth - margin, 1);
  const y = frame.mainChart.yEnd - height;

  useEffect(() => {
    // on('drag', ({ x }) => setXOffset(-x));
  }, []);

  return (
    <Rect
      transformsEnabled="position"
      perfectDrawEnabled={false}
      listening={false}
      x={x - candleWidth / 2 + xOffset}
      y={y}
      width={candleWidth}
      height={height}
      fill={transparentize(0.75, color)}
    />
  );
}
