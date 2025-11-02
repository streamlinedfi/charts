import { mix } from 'polished';
import React, { useEffect, useRef } from 'react';
import getBarCoordinate from '../modules/getBarCoordinate';
import getZOrderedDatasets from '../modules/getZOrderedDatasets';
import useContext from '../modules/useContext';
import useRenderer from '../modules/useRenderer';
import Crosshair from './Crosshair';
import { Rect } from './konva';
import LineDrawings from './LineDrawings';
import Menu from './Menu';

const jstr = JSON.stringify;

function renderLine({ stroke, strokeWidth, points }) {
  return [
    {
      type: 'Line',
      attrs: {
        points,
        stroke,
        strokeWidth,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
  ];
}

function renderBar({ width, height, x, y, fill, cornerRadius }) {
  return [
    {
      type: 'Rect',
      attrs: {
        x,
        y,
        width,
        height,
        fill,
        cornerRadius,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
  ];
}

function InnerChart({ layerRef }) {
  const renderer = useRenderer(layerRef.current);
  const prevBarsRef = useRef([]);
  const {
    frame,
    scales,
    config,
    activeScale,
    setCursor,
    dispatch,
  } = useContext();
  const data = getZOrderedDatasets(config, activeScale);

  useEffect(() => {
    renderer.destroyAll();

    const barKeys = {};
    data.forEach(([dataset, i]) => {
      const scale = scales[config.sharedScale ? 0 : i];
      const { barWidth, getBarX } = getBarCoordinate(config, scale);

      dataset.series
        .map(entry => {
          const key = i + entry.x + entry.y;
          barKeys[key] = key;

          return {
            ...entry,
            key,
          };
        })
        .forEach(({ key, x, y, color }, j) => {
          if (j === 0) {
            // remove bars that are no longer in the chart
            prevBarsRef.current.forEach(prevKey => {
              if (!barKeys[prevKey]) {
                renderer.destroy(prevKey);
              }
            });

            prevBarsRef.current = Object.keys(barKeys);
          }

          const isPositive = Number(y) >= 0;

          if (!x) {
            return;
          }

          renderer(renderBar, {
            key,
            x: getBarX(i, x),
            width: barWidth,
            fill:
              color || mix(0.1, config.theme.bgColor, config.theme.colors[i]),
            ...(isPositive
              ? {
                  y: scale.y(y),
                  height: scale.y(0) - scale.y(y),
                  cornerRadius: [
                    config.theme.bar.borderRadius,
                    config.theme.bar.borderRadius,
                    0,
                    0,
                  ],
                }
              : {
                  y: scale.y(0),
                  height: scale.y(y) - scale.y(0),
                  cornerRadius: [
                    0,
                    0,
                    config.theme.bar.borderRadius,
                    config.theme.bar.borderRadius,
                  ],
                }),
          });
        });

      renderer(renderLine, {
        stroke: config.theme.axes.lineColor,
        strokeWidth: 1,
        points: [
          frame.innerChart.xStart,
          scale.y(0),
          frame.innerChart.xEnd,
          scale.y(0),
        ],
      });
    });

    return () => {
      renderer.destroyAll();
    };
  }, [dispatch, jstr(data)]);

  return (
    <>
      <Rect
        x={frame.innerChart.xStart}
        y={frame.innerChart.yStart}
        width={frame.innerChart.width}
        height={frame.innerChart.height}
        onMouseEnter={() => setCursor('crosshair')}
        onMouseLeave={() => setCursor('default')}
        onClick={event => {
          dispatch('innerChartClick', event);
        }}
      />
      <Crosshair />
      <LineDrawings />
      <Menu />
    </>
  );
}

export default InnerChart;
