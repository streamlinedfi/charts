import { useRef } from 'react';
import useContext from '../modules/useContext';
import useRenderer from '../modules/useRenderer';
import useScales from '../modules/useScales';

const jstr = JSON.stringify;

function renderTick({ frame, config, value, y }) {
  return [
    config.theme.grid.showY && {
      type: 'Line',
      attrs: {
        points: [frame.mainChart.xStart, y, frame.mainChart.xEnd, y],
        stroke: config.theme.grid.lineColor,
        strokeWidth: 1,
        perfectDrawEnabled: false,
        listening: false,
      },
    },
    {
      type: 'Line',
      attrs: {
        points: [
          frame.yAxis.xStart,
          y,
          frame.yAxis.xStart + config.theme.axes.tickSize,
          y,
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
        fontWeight: config.theme.fontWeight,
        fontSize: config.theme.axes.fontSize,
        text: config.formatters.axes.y(value),
        fill: config.theme.axes.color,
        x:
          frame.yAxis.xStart +
          config.theme.axes.tickSize +
          config.theme.axes.tickMargin,
        y: y + 1,
        offsetY: config.theme.axes.fontSize / 2,
        perfectDrawEnabled: false,
      },
    },
  ];
}

function YAxis() {
  const { dispatch, config, data, frame } = useContext();
  const prevTicksRef = useRef([]);
  const layerRef = useRef();
  const renderer = useRenderer(layerRef.current);
  const scales = useScales('indicatorYAxis');

  // useEffect(() => {
  //   if (data.series) {
  //     scales.onChange(() => {
  //       const tickKeys = {};
  //       forEach(scales.yTicks, tick => {
  //         const key = tick.value;
  //         renderer(renderTick, {
  //           key,
  //           show:
  //             tick.y !== undefined &&
  //             !Number.isNaN(tick.y) &&
  //             inRange(tick.y, scales.y.range()[0], last(scales.y.range())) &&
  //             inRange(
  //               tick.value,
  //               scales.y.domain()[0],
  //               last(scales.y.domain()),
  //             ),
  //           value: config.formatters.axes.y(tick.value),
  //           y: tick.y,
  //         });
  //         tickKeys[key] = key;
  //       });

  //       // remove ticks that are no longer in the scale
  //       forEach(prevTicksRef.current, prevKey => {
  //         if (!tickKeys[prevKey]) {
  //           renderer.destroy(prevKey);
  //         }
  //       });

  //       prevTicksRef.current = Object.keys(tickKeys);

  //       // last ytick
  //       const lastEntry = last(data.series);
  //       const lastY = scales.y(lastEntry.close);
  //       const fill =
  //         lastEntry.close > lastEntry.open
  //           ? config.theme.candleUpColor
  //           : config.theme.candleDownColor;

  //       // rerender so that it's drawn over other ticks
  //       renderer.destroy('lastClose');
  //       renderer(renderYTick, {
  //         key: 'lastClose',
  //         y: lastY,
  //         show: inRange(lastY, frame.yAxis.yStart, frame.yAxis.yEnd),
  //         text: config.formatters.axes.y(lastEntry.close),
  //         fill,
  //       });
  //     });
  //   }
  // }, [dispatch, layerRef.current, data.seriesId, jstr(frame.yAxis)]);

  // // useEffect(() => {
  // //   if (data.series) {
  // //     scales.onChange(() => {

  // //     });
  // //   }
  // // }, [scales.loaded, data.seriesId, jstr(frame.yAxis)]);

  // useEffect(() => {
  //   if (data.series) {
  //     renderer(
  //       ({ frame, config }) => [
  //         {
  //           type: 'Line',
  //           attrs: {
  //             stroke: config.theme.axes.lineColor,
  //             strokeWidth: 1,
  //             points: [
  //               frame.xAxis.xStart,
  //               frame.xAxis.yStart,
  //               frame.xAxis.xEnd,
  //               frame.xAxis.yStart,
  //             ],
  //             perfectDrawEnabled: false,
  //             listening: false,
  //           },
  //         },
  //         {
  //           type: 'Line',
  //           attrs: {
  //             stroke: config.theme.axes.lineColor,
  //             strokeWidth: 1,
  //             points: [
  //               frame.yAxis.xStart,
  //               frame.yAxis.yStart,
  //               frame.yAxis.xStart,
  //               frame.yAxis.yEnd,
  //             ],
  //             perfectDrawEnabled: false,
  //             listening: false,
  //           },
  //         },
  //       ],
  //       {
  //         key: 'axeslines',
  //       },
  //     );
  //   }
  // }, [data.seriesId, jstr(frame.yAxis)]);

  // return <Layer ref={layerRef} />;
  return null;
}

export default YAxis;
