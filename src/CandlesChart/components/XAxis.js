import forEach from 'lodash/forEach';
import inRange from 'lodash/inRange';
import React, { useEffect, useRef } from 'react';
import useContext from '../modules/useContext';
import useRenderer from '../modules/useRenderer';
import useScales from '../modules/useScales';
import { Layer } from './konva';

const jstr = JSON.stringify;

function renderTick({ frame, config, value, x, emphasize }) {
  return [
    {
      type: 'Line',
      attrs: {
        points: [
          x,
          frame.xAxis.yStart,
          x,
          frame.xAxis.yStart + config.theme.axes.tickSize,
        ],
        stroke: config.theme.axes.tickColor,
        strokeWidth: 1,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Text',
      attrs: {
        fontFamily: config.theme.fontFamily,
        fontStyle: emphasize ? 600 : config.theme.fontStyle,
        fontSize: config.theme.axes.fontSize,
        fill: emphasize
          ? config.theme.axes.emphasizeColor
          : config.theme.axes.color,
        x,
        y:
          frame.xAxis.yStart +
          config.theme.axes.tickSize +
          config.theme.axes.tickMargin,
        text: value,
        listening: false,
      },
    },
  ];
}

function XAxis() {
  const { dispatch, frame, config } = useContext();
  const layerRef = useRef();
  const prevTicksRef = useRef([]);
  const renderer = useRenderer(layerRef.current);
  const scales = useScales('xAxis');

  useEffect(() => {
    scales.onChange(() => {
      const tickKeys = {};
      forEach(scales.xTicks, (tick, i) => {
        const key = tick.i;

        // dont show first tick if it’s overlapping the second
        if (i === 0 && tick.x + 50 > scales.xTicks?.[1]?.x) {
          return;
        }

        renderer(renderTick, {
          key,
          show: inRange(tick.x, frame.mainChart.xStart, frame.mainChart.xEnd),
          value: tick.value,
          x: tick.x,
          emphasize: tick.emphasize,
        });
        tickKeys[key] = key;
      });

      // remove ticks that are no longer in the scale
      forEach(prevTicksRef.current, prevKey => {
        if (!tickKeys[prevKey]) {
          renderer.destroy(prevKey);
        }
      });

      prevTicksRef.current = Object.keys(tickKeys);
    });
  }, [dispatch, layerRef.current, jstr(frame.xAxis)]);

  return <Layer ref={layerRef} />;
}

export default XAxis;
