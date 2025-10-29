import React from 'react';
import { Line } from './konva';

export default function AngleDown({ x, y, size = 10, color }) {
  return (
    <>
      <Line
        stroke={color}
        strokeWidth={1.5}
        points={[x, y, x + size / 2, y + size / 2]}
        lineCap="round"
      />
      <Line
        stroke={color}
        strokeWidth={1.5}
        points={[x + size / 2, y + size / 2, x + size, y]}
        lineCap="round"
      />
    </>
  );
}
