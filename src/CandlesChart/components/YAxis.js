import React, { useRef, useEffect, useState } from 'react';
import inRange from 'lodash/inRange';
import forEach from 'lodash/forEach';
import last from 'lodash/last';
import { Layer } from './konva';
import useContext from '../modules/useContext';
import useRenderer from '../modules/useRenderer';
import useScales from '../modules/useScales';
import renderYTick from '../renderers/YTick';
import renderActiveYTick from '../renderers/activeYTick';

function YAxis() {
  const { config, data, frame } = useContext();
  const prevTicksRef = useRef([]);
  const layer1Ref = useRef();
  const layer2Ref = useRef();
  const renderer = useRenderer(layer1Ref.current);
  const axesRenderer = useRenderer(layer2Ref.current);
  const scales = useScales('yAxis');

  if (layer1Ref.current && scales.loaded && data.series) {
    const renderTicks = () => {
      const tickKeys = {};
      forEach(scales.yTicks, tick => {
        const key = tick.value;

        const show =
          tick.y !== undefined &&
          !Number.isNaN(tick.y) &&
          inRange(tick.y, scales.y.range()[0], last(scales.y.range())) &&
          inRange(tick.value, scales.y.domain()[0], last(scales.y.domain()));

        renderer(renderYTick, {
          key,
          show,
          value: config.formatters.axes.y(tick.value),
          y: tick.y,
        });
        tickKeys[key] = key;
      });

      // remove ticks that are no longer in the scale
      forEach(prevTicksRef.current, prevKey => {
        if (!tickKeys[prevKey]) {
          // console.log('destroy', prevKey);
          renderer.destroy(prevKey);
        }
      });

      prevTicksRef.current = Object.keys(tickKeys);

      // last ytick
      const lastEntry = last(data.series);
      const lastY = scales.y(lastEntry.close);
      const fill =
        lastEntry.close > lastEntry.open
          ? config.theme.candleUpColor
          : config.theme.candleDownColor;

      // rerender so that it's drawn over other ticks
      renderer.destroy('lastClose');
      renderer(renderActiveYTick, {
        key: 'lastClose',
        y: lastY,
        show: inRange(lastY, frame.yAxis.yStart, frame.yAxis.yEnd),
        text: config.formatters.axes.y(lastEntry.close),
        fill,
      });
    };

    renderTicks();
    scales.onChange(renderTicks);

    const renderAxesLines = () => {
      axesRenderer(
        ({ frame, config }) => [
          {
            type: 'Line',
            attrs: {
              stroke: config.theme.axes.lineColor,
              strokeWidth: 1,
              points: [
                frame.xAxis.xStart,
                frame.xAxis.yStart,
                frame.xAxis.xEnd,
                frame.xAxis.yStart,
              ],
              perfectDrawEnabled: false,
              listening: false,
            },
          },
          {
            type: 'Line',
            attrs: {
              stroke: config.theme.axes.lineColor,
              strokeWidth: 1,
              points: [
                frame.yAxis.xStart,
                frame.yAxis.yStart,
                frame.yAxis.xStart,
                frame.yAxis.yEnd,
              ],
              perfectDrawEnabled: false,
              listening: false,
            },
          },
        ],
        {
          key: 'axeslines',
        },
      );
    };

    // axesRenderer.destroyAll();
    renderAxesLines();
  }

  return (
    <>
      <Layer ref={layer1Ref} />
      <Layer ref={layer2Ref} />
    </>
  );
}

export default YAxis;
