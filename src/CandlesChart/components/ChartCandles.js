/* eslint-disable no-shadow */
/* eslint-disable consistent-return */
import { useEffect } from 'react';
import forEach from 'lodash/forEach';
import last from 'lodash/last';
import inRange from 'lodash/inRange';
import useScales from '../modules/useScales';
import useContext from '../modules/useContext';
import useRenderer from '../modules/useRenderer';
import renderCandle from '../renderers/candle';

const jstr = JSON.stringify;

export default function ChartCandles({ layerRef }) {
  const renderer = useRenderer(layerRef.current);
  const scales = useScales('candles');
  const { frame, config, data } = useContext();

  useEffect(() => {
    if (scales.loaded && data.series) {
      const renderSeries = () => {
        const stepWidth =
          (last(scales.x.range()) - scales.x.range()[0]) /
          (last(scales.x.domain()) - scales.x.domain()[0]);

        const lastI = last(data.series).i;

        forEach(data.series, entry => {
          const x = scales.x(entry.i);

          renderer(renderCandle, {
            key: `candle.${entry.i}`,
            stepWidth,
            show: inRange(
              x,
              frame.mainChart.xStart - stepWidth,
              frame.mainChart.xEnd + stepWidth,
            ),
            x,
            open: scales.y(entry.open),
            high: scales.y(entry.high),
            low: scales.y(entry.low),
            close: scales.y(entry.close),
            color:
              entry.close >= entry.open
                ? config.theme.candleUpColor
                : config.theme.candleDownColor,
            // ensure last candle is always rendered
            minWidth: entry.i === lastI ? 1 : 0,
          });
        });
      };

      renderSeries();
      scales.onChange(renderSeries);
    }

    return () => {
      renderer.destroyAll();
    };
  }, [
    data.seriesId,
    scales.loaded,
    config.timeframe.id,
    jstr(frame.mainChart),
  ]);

  return null;
}
