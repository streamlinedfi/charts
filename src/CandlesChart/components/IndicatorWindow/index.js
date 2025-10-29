import { scaleLinear } from 'd3-scale';
import React from 'react';
import useContext from '../../modules/useContext';
import { domainMapping, IndicatorContext, seriesMapping } from './_module';
import Axes from './Axes';
import Chart from './Chart';
import CrosshairYTick from './CrosshairYTick';
import InfoWindow from './InfoWindow';

export default function IndicatorWindow({
  indicator,
  i,
  indicatorFrame,
  scales,
  baseRenderer,
  topRenderer,
}) {
  const { data, config } = useContext();
  const key = indicator.indicator.replace(/\s/g, '') + i;

  if (indicator.active) {
    const getSeries = seriesMapping[indicator.indicator];
    const series = getSeries(data, indicator);

    const yScale = scaleLinear()
      .domain(domainMapping[indicator.indicator](series))
      .range([
        indicatorFrame.yStart + config.theme.indicatorWindow.splitLineWidth,
        indicatorFrame.yEnd,
      ]);

    const indicatorContext = {
      baseRenderer,
      topRenderer,
      yScale,
      scales,
      key,
      indicator,
      indicatorFrame,
      series,
    };

    return (
      <IndicatorContext.Provider value={indicatorContext}>
        <Axes />
        <Chart />
        <InfoWindow />
        <CrosshairYTick />
      </IndicatorContext.Provider>
    );
  }

  baseRenderer.destroyAllWith(key);
  topRenderer.destroyAllWith(key);

  return null;
}
