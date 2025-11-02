import inRange from 'lodash/inRange';
import React, { useEffect, useState } from 'react';
import getBarCoordinate from '../modules/getBarCoordinate';
import useContext from '../modules/useContext';
import { Line } from './konva';
import Text from './Text';
import YTick from './YTick';

const id = 'crosshair';

function isTouchDevice() {
  return !!(
    'ontouchstart' in window ||
    navigator.maxTouchPoints > 0 ||
    navigator.msMaxTouchPoints > 0
  );
}

function getClosestBarByX(config, scales, x) {
  const closest = {};

  for (let di = 0; di < config.data.length; di++) {
    const dataset = config.data[di];
    const scale = scales[config.sharedScale ? 0 : di];
    const { barWidth, getBarX } = getBarCoordinate(config, scale);

    for (let i = 0; i < dataset.series.length; i++) {
      const xStart = getBarX(di, dataset.series[i].x);
      const xCenter = xStart + barWidth / 2;

      const diff = Math.abs(xCenter - x);

      if (!Object.keys(closest).length || diff < closest.diff) {
        closest.dataset = i;
        closest.i = i;
        closest.diff = diff;
        closest.x = xCenter;
        closest.xText = dataset.series[i].x;
        closest.y = scale.y(dataset.series[i].y);
        closest.meta = dataset.series[i].meta;
      } else {
        // break;
      }
    }
  }

  return closest;
}

function Crosshair() {
  const { scales, frame, config, activeScale, on, off, tool } = useContext();
  const [pos, setPos] = useState({ x: null, y: null });
  const [fixedPos, setFixedPos] = useState({ x: null, y: null });

  let x = fixedPos.x || pos.x;
  let y = fixedPos.y || pos.y;
  let xText = '';

  const xInRange =
    !!x && inRange(x, frame.innerChart.xStart, frame.innerChart.xEnd);

  // config.snap
  if (xInRange) {
    const closestPoint = getClosestBarByX(config, scales, x);

    x = closestPoint.x;
    xText = closestPoint.xText;
    y = closestPoint.y;
  }

  // const xText = config.formatters.crosshair.x(
  //   scaleBandInvert(scales[activeScale].x)(x),
  // );
  // const xText = 'a';
  const yText = config.formatters.crosshair.y(scales[activeScale].y.invert(y));

  useEffect(() => {
    if (tool !== 'crosshair') {
      setFixedPos({ x: null, y: null });
    }
  }, [tool]);

  useEffect(() => {
    on(
      'mousemove',
      ({ inInnerChartRange, evt }) => {
        setPos({
          x: inInnerChartRange ? evt.offsetX : null,
          y: inInnerChartRange ? evt.offsetY : null,
        });
      },
      id,
    );

    // @TODO
    // on(
    //   'click',
    //   ({ inInnerChartRange, evt }) => {
    //     if (evt.which === 1 && tool === 'crosshair' && !selectedLine) {
    //       setFixedPos(
    //         fixedPos.x
    //           ? { x: null, y: null }
    //           : {
    //               x: inInnerChartRange ? evt.offsetX : null,
    //               y: inInnerChartRange ? evt.offsetY : null,
    //             },
    //       );
    //     }
    //   },
    //   id,
    // );

    return () => {
      off('mousemove', id);
      off('click', id);
    };
  }, [fixedPos, tool, setPos]);

  if (!xInRange || isTouchDevice()) return null;

  return (
    <>
      <Line
        stroke={config.theme.crosshair.lineColor}
        strokeWidth={1}
        dash={config.theme.crosshair.lineDash}
        points={[x, frame.innerChart.yStart, x, frame.innerChart.yEnd]}
      />
      <Line
        stroke={config.theme.crosshair.tickColor}
        strokeWidth={1}
        points={[
          x,
          frame.xAxis.yStart,
          x,
          frame.xAxis.yStart + config.theme.axes.tickSize,
        ]}
      />
      <Text
        text={xText}
        x={x}
        y={
          frame.xAxis.yStart +
          config.theme.axes.tickSize +
          config.theme.axes.tickMargin
        }
        fontSize={config.theme.axes.fontSize}
        fill={config.theme.crosshair.color}
        bgPadding={1}
        bgFill={config.theme.bgColor}
      />
      <Line
        stroke={config.theme.crosshair.lineColor}
        strokeWidth={1}
        dash={config.theme.crosshair.lineDash}
        points={[frame.innerChart.xStart, y, frame.innerChart.xEnd, y]}
      />
      <YTick y={y} text={yText} fill={config.theme.crosshair.color} />
    </>
  );
}

export default Crosshair;
