import React, { useRef } from 'react';
import { Group, Line } from './konva';
import getZOrderedDatasets from '../modules/getZOrderedDatasets';
import useContext from '../modules/useContext';
import Text from './Text';
import YTick from './YTick';

function YAxis() {
  const { frame, config, scales, activeScale, setActiveScale } = useContext();
  const yTickyEnd = useRef(config.height);

  return (
    <>
      {scales[activeScale].y.ticks().map((tick, i) => {
        const y = scales[activeScale].y(tick);

        if (i > 0 && y > yTickyEnd.current - config.theme.axes.minTickSpaceY) {
          return;
        }

        yTickyEnd.current = y - config.theme.axes.fontSize;

        // eslint-disable-next-line consistent-return
        return (
          <Group key={tick}>
            {config.theme.grid.showY && (
              <Line
                points={[frame.innerChart.xStart, y, frame.innerChart.xEnd, y]}
                stroke={config.theme.grid.lineColor}
                strokeWidth={1}
              />
            )}
            <Line
              points={[
                frame.yAxis.xStart,
                y,
                frame.yAxis.xStart + config.theme.axes.tickSize,
                y,
              ]}
              stroke={config.theme.axes.tickColor}
              strokeWidth={1}
            />
            <Text
              text={config.formatters.axes.y(tick)}
              fontSize={config.theme.axes.fontSize}
              fill={config.theme.axes.color}
              x={
                frame.yAxis.xStart +
                config.theme.axes.tickSize +
                config.theme.axes.tickMargin
              }
              y={y + 1}
              offsetY={config.theme.axes.fontSize / 2}
            />
          </Group>
        );
      })}
      {getZOrderedDatasets(config, activeScale).map(([dataset, index]) => {
        const lastValue = dataset.series[dataset.series.length - 1];
        if (!lastValue) return null;

        const lastY = scales[config.sharedScale ? 0 : index].y(lastValue.y);

        return (
          <YTick
            key={dataset.name + index}
            y={lastY}
            text={config.formatters.axes.y(lastValue.y)}
            fill={config.theme.colors[index]}
            onClick={
              !config.sharedScale ? () => setActiveScale(index) : undefined
            }
          />
        );
      })}
      <Line
        stroke={config.theme.axes.lineColor}
        strokeWidth={1}
        points={[
          frame.xAxis.xStart,
          frame.xAxis.yStart,
          frame.xAxis.xEnd,
          frame.xAxis.yStart,
        ]}
      />
      <Line
        stroke={config.theme.axes.lineColor}
        strokeWidth={1}
        points={[
          frame.yAxis.xStart,
          frame.yAxis.yStart,
          frame.yAxis.xStart,
          frame.yAxis.yEnd,
        ]}
      />
    </>
  );
}

export default YAxis;
