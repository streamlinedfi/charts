import React, { useRef } from 'react';
import Konva from 'konva';
import { Group, Line } from './konva';
import useContext from '../modules/useContext';
import Text from './Text';

function XAxis() {
  const { frame, config, scales, activeScale } = useContext();
  const xTickxEnd = useRef(frame.xAxis.xStart);

  return (
    <>
      {config.data[activeScale].series.map((entry, i) => {
        const x = scales[activeScale].x(entry.x);

        if (i > 0 && x < xTickxEnd.current + config.theme.axes.minTickSpaceX) {
          return;
        }

        const text = config.formatters.axes.x(entry.x);
        xTickxEnd.current =
          x +
          new Konva.Text({
            text,
            fontFamily: config.theme.axes.fontFamily || config.theme.fontFamily,
            fontStyle: 500,
            fontSize: config.theme.axes.fontSize,
          }).getTextWidth();

        // eslint-disable-next-line consistent-return
        return (
          <Group key={entry.x}>
            {config.theme.grid.showX && (
              <Line
                points={[x, frame.innerChart.yStart, x, frame.innerChart.yEnd]}
                stroke={config.theme.grid.lineColor}
                strokeWidth={1}
              />
            )}
            <Line
              points={[
                x,
                frame.xAxis.yStart,
                x,
                frame.xAxis.yStart + config.theme.axes.tickSize,
              ]}
              stroke={config.theme.axes.tickColor}
              strokeWidth={1}
            />
            <Text
              text={text}
              x={x}
              y={
                frame.xAxis.yStart +
                config.theme.axes.tickSize +
                config.theme.axes.tickMargin
              }
              fontSize={config.theme.axes.fontSize}
              fill={config.theme.axes.color}
            />
          </Group>
        );
      })}
    </>
  );
}

export default XAxis;
