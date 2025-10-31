import Konva from 'konva';
import inRange from 'lodash/inRange';
import moment from 'moment-timezone';
import React, { useEffect, useRef } from 'react';
import useContext from '../modules/useContext';
import useRenderer from '../modules/useRenderer';
import useScales from '../modules/useScales';
import renderYTick from '../renderers/activeYTick';
import { Layer } from './konva';

const jstr = JSON.stringify;
const { values } = Object;

function renderCrosshair({ config, frame, x, y, candle }) {
  const textAttrs = {
    fontFamily: config.theme.fontFamily,
    fontWeight: config.theme.fontWeight,
    fontSize: config.theme.axes.fontSize,
    // text: config.formatters.crosshair.x(candle?.time),
    text: moment
      .tz(candle?.time, config.timezone)
      .format(
        config.timeframe.id === 'D1' ? 'ddd D MMM ’YY' : 'H:mm ddd D MMM ’YY',
      ),
    x,
    y:
      frame.xAxis.yStart +
      config.theme.axes.tickSize +
      config.theme.axes.tickMargin,
    fill: config.theme.crosshair.color,
  };

  const textWidth = new Konva.Text(textAttrs).getTextWidth();

  return [
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.crosshair.lineColor,
        strokeWidth: 1,
        dash: config.theme.crosshair.lineDash,
        points: [x, frame.mainInner.yStart, x, frame.mainInner.yEnd],
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.crosshair.lineColor,
        strokeWidth: 1,
        dash: config.theme.crosshair.lineDash,
        points: [frame.mainInner.xStart, y, frame.mainInner.xEnd, y],
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    // xaxis tick:
    {
      type: 'Line',
      attrs: {
        stroke: config.theme.crosshair.tickColor,
        strokeWidth: 1,
        points: [
          x,
          frame.xAxis.yStart,
          x,
          frame.xAxis.yStart + config.theme.axes.tickSize,
        ],
        transformsEnabled: 'none',
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Rect',
      attrs: {
        x: x - 1,
        y: frame.xAxis.yStart + config.theme.axes.tickSize - 1,
        // zIndex: 999,
        width: textWidth + 1 * 2,
        height: config.theme.axes.fontSize + 1 * 2,
        fill: config.theme.bgColor,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Text',
      attrs: {
        ...textAttrs,
        // zIndex: 1000,
      },
    },
  ];
}

function Crosshair() {
  const { config, frame, data, dispatch } = useContext();
  const layerRef = useRef();
  const candleRef = useRef();
  const renderer = useRenderer(layerRef.current);
  const scales = useScales('crosshair');
  const key = 'crosshair';
  const yTickKey = `${key}:ytick`;

  useEffect(() => {
    if (data.series && scales.loaded) {
      // eslint-disable-next-line no-inner-declarations
      function destroyCrosshair(zoomEvent) {
        if (zoomEvent.sourceEvent?.type !== 'wheel') {
          renderer.destroy(key);
          renderer.destroy(yTickKey);
        }
      }

      dispatch.on('zoomX.crosshair', destroyCrosshair);
      dispatch.on('zoomY.crosshair', destroyCrosshair);

      dispatch.on('mousemove.crosshair', event => {
        if (event) {
          renderer(renderCrosshair, {
            key,
            x: event.offsetX,
            y: event.offsetY,
            candle: candleRef.current,
          });

          if (
            inRange(event.offsetY, frame.mainChart.yStart, frame.mainChart.yEnd)
          ) {
            renderer(renderYTick, {
              key: yTickKey,
              x: event.offsetX,
              y: event.offsetY,
              fill: config.theme.crosshair.color,
              text: config.formatters.crosshair.y(
                scales.y?.invert(event.offsetY),
              ),
            });
          } else {
            renderer.destroy(yTickKey);
          }
        } else {
          renderer.destroy(key);
          renderer.destroy(yTickKey);
        }
      });

      dispatch.on('candle.crosshair', candle => {
        candleRef.current = candle;
      });
    }
  }, [
    dispatch,
    scales.loaded,
    data.seriesId,
    jstr(frame.mainChart),
    jstr(frame.indicatorWindows),
  ]);

  return <Layer ref={layerRef} />;
}

export default Crosshair;
