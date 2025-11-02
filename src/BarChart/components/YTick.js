import React from 'react';
import { mix } from 'polished';
import { Group, Line } from './konva';
import useContext from '../modules/useContext';
import Text from './Text';

function YTick({ y, text, fill, onClick }) {
  const { frame, config, setCursor } = useContext();
  const bgSize = config.theme.axes.lastValueTickBgSize;

  return (
    <Group
      onClick={onClick}
      onMouseEnter={onClick ? () => setCursor('pointer') : undefined}
      onMouseLeave={onClick ? () => setCursor('default') : undefined}
    >
      <Line
        fill={mix(0.2, fill, config.theme.bgColor)}
        points={[
          frame.yAxis.xStart,
          y,
          frame.yAxis.xStart + bgSize / 2,
          y - bgSize / 2,
          frame.yAxis.xEnd,
          y - bgSize / 2,
          frame.yAxis.xEnd,
          y + bgSize / 2,
          frame.yAxis.xStart + bgSize / 2,
          y + bgSize / 2,
          frame.yAxis.xStart,
          y,
        ]}
        closed
      />
      <Line
        stroke={fill}
        strokeWidth={1}
        points={[
          frame.yAxis.xStart,
          y,
          frame.yAxis.xStart + config.theme.axes.tickSize,
          y,
        ]}
      />
      <Text
        text={text}
        x={
          frame.yAxis.xStart +
          config.theme.axes.tickSize +
          config.theme.axes.tickMargin
        }
        y={y + 1}
        offsetY={config.theme.axes.fontSize / 2}
        fill={fill}
        fontSize={config.theme.axes.fontSize}
      />
    </Group>
  );
}

export default YTick;
