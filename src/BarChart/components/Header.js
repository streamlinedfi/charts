import React from 'react';
import { Group, Rect, Circle } from './konva';
import useContext from '../modules/useContext';
import Text from './Text';

function Header() {
  const { frame, config, setActiveScale, setCursor } = useContext();

  return (
    <>
      <Text
        text={config.title}
        x={frame.header.xStart}
        y={frame.header.yStart}
        fontFamily={config.theme.title.fontFamily}
        fontSize={config.theme.title.fontSize}
        fill={config.theme.title.color}
      />
      {config.data
        .map((dataset, index) => ({
          dataset,
          index,
          xStart: frame.legend.items[index].xStart,
          yStart: frame.legend.items[index].yStart,
          color: config.theme.colors[index],
        }))
        .map(({ dataset, index, xStart, yStart, color }) => (
          <Group
            key={dataset.name + index}
            onClick={
              !config.sharedScale ? () => setActiveScale(index) : undefined
            }
            onMouseEnter={
              !config.sharedScale ? () => setCursor('pointer') : undefined
            }
            onMouseLeave={
              !config.sharedScale ? () => setCursor('default') : undefined
            }
          >
            <Circle
              x={xStart}
              y={yStart + config.theme.legend.circle.positionTop}
              radius={config.theme.legend.circle.size / 2}
              offsetX={-config.theme.legend.circle.size / 2}
              offsetY={-config.theme.legend.circle.size / 2}
              stroke={color}
              strokeWidth={config.theme.legend.circle.lineWidth}
            />
            <Rect
              x={xStart + config.theme.legend.circle.size}
              y={yStart}
              width={config.theme.legend.circle.marginRight}
              height={config.theme.legend.fontSize}
            />
            <Text
              text={dataset.name}
              x={
                xStart +
                config.theme.legend.circle.size +
                config.theme.legend.circle.marginRight
              }
              y={yStart}
              fontFamily={
                config.theme.legend.fontFamily || config.theme.fontFamily
              }
              fontSize={config.theme.legend.fontSize}
              fill={config.theme.legend.color}
            />
          </Group>
        ))}
    </>
  );
}

export default Header;
