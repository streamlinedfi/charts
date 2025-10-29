import { useEffect } from 'react';
import { SMA, EMA, BollingerBands } from '@debut/indicators';
import useContext from '../modules/useContext';
import useRenderer from '../modules/useRenderer';
import useScales from '../modules/useScales';
import { Indicators } from '../modules/indicators';
import renderMA from '../renderers/ma';
import renderBB from '../renderers/bb';

const jstr = JSON.stringify;

function getMASeries(data, indicator) {
  if (!data.series) {
    return [];
  }
  const MA = indicator.type === 'SMA' ? SMA : EMA;
  const ma = new MA(Number(indicator.length));
  return data.series?.map(entry => {
    return {
      i: entry.i,
      value: ma.nextValue(entry.close),
    };
  });
}

function getBBSeries(data, indicator) {
  if (!data.series) {
    return [];
  }
  const bb = new BollingerBands(
    Number(indicator.length),
    Number(indicator.stdDev),
  );
  return data.series
    ?.map(entry => {
      return {
        i: entry.i,
        values: bb.nextValue(entry.close),
      };
    })
    .filter(entry => entry.values);
}

const seriesMapping = {
  [Indicators.MA]: getMASeries,
  [Indicators.BB]: getBBSeries,
};

const renderMapping = {
  [Indicators.MA]: renderMA,
  [Indicators.BB]: renderBB,
};

export default function ChartIndicators({ layerRef }) {
  const { config, setConfig, frame, data } = useContext();
  const renderer = useRenderer(layerRef.current);
  const scales = useScales('indicators');

  if (scales.loaded) {
    renderer.destroyAll();
    config.indicators.mainChart.forEach((indicator, i) => {
      const key = indicator.indicator.replace(/\s/g, '') + i;
      const indicatorKey = `${key}.mainChart`;

      if (indicator.active) {
        const getSeries = seriesMapping[indicator.indicator] || (() => []);
        const series = getSeries(data, indicator);
        if (!series.length) return;

        const render = () => {
          renderer(renderMapping[indicator.indicator], {
            key: indicatorKey,
            indicator,
            scales,
            series,
            frame,
            config,
          });
        };

        render();
        scales.onChange(render, indicatorKey);
      } else {
        scales.offChange(indicatorKey);
        renderer.destroy(indicatorKey);
      }
    });
  }

  useEffect(() => {
    if (config.indicators.mainChart.some(indicator => indicator.shouldRemove)) {
      setConfig({
        ...config,
        indicators: {
          ...config.indicators,
          mainChart: config.indicators.mainChart.filter(
            indicator => !indicator.shouldRemove,
          ),
        },
      });
    }
  }, [jstr(config.indicators.mainChart)]);

  return null;
}
