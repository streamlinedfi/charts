import { useEffect } from 'react';
import forEach from 'lodash/forEach';
import useContext from '../../modules/useContext';
import renderYTick from '../../renderers/YTick';
import { Indicators } from '../../modules/indicators';
import { ticksMapping, useIndicatorContext } from './_module';

export default function Axes() {
  const { frame, config } = useContext();
  const {
    baseRenderer: renderer,
    key,
    yScale,
    indicator,
    indicatorFrame,
    series,
    scales,
  } = useIndicatorContext();

  if (series.length && scales.loaded) {
    const render = () => {
      const yTicks = ticksMapping[indicator.indicator](yScale, {
        config,
        frame,
        indicator,
        indicatorFrame,
      });

      forEach(yTicks, tick => {
        renderer(renderYTick, {
          key: `${key}.ticks.${tick.value}`,
          value: config.formatters.axes.y(tick.value),
          y: tick.y,
          showLine: [Indicators.ATR, Indicators.MACD].includes(
            indicator.indicator,
          ),
        });
      });
    };

    renderer.destroyAllWith(`${key}.ticks`);
    render();
    scales.onChange(render, `${key}.ticks`);
  }

  useEffect(() => {
    return () => {
      scales.offChange(`${key}.ticks`);
    };
  }, []);

  return null;
}
