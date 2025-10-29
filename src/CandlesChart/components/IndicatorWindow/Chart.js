import { useEffect } from 'react';
import { renderMapping, useIndicatorContext } from './_module';

export default function Chart() {
  const {
    baseRenderer: renderer,
    key,
    yScale,
    indicator,
    indicatorFrame,
    series,
    scales,
  } = useIndicatorContext();
  const chartKey = `${key}.chart`;

  if (series.length && scales.loaded) {
    const render = () => {
      // macd histogram should use the show prop for each bar
      // destroyAllWith is temporary because we'd need
      // to split the renderers for each indicator
      renderer.destroyAllWith(chartKey);
      renderer(renderMapping[indicator.indicator], {
        key: chartKey,
        indicatorFrame,
        indicator,
        series,
        scales,
        yScale,
      });
    };

    // renderer.destroyAllWith(chartKey);
    render();
    scales.onChange(render, chartKey);
  }

  useEffect(() => {
    return () => {
      scales.offChange(chartKey);
    };
  }, []);

  return null;
}
