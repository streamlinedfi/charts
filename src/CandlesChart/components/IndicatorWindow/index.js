import React from 'react';
import { scaleLinear } from 'd3-scale';
import Axes from './Axes';
import Chart from './Chart';
import InfoWindow from './InfoWindow';
import BacktestsWindow from './BacktestsWindow';
import CrosshairYTick from './CrosshairYTick';
import useContext from '../../modules/useContext';
import { domainMapping, seriesMapping, IndicatorContext } from './_module';

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
        {!!config.backtests?.length && indicator.indicator === 'MACD' && (
          <BacktestsWindow />
        )}
        <CrosshairYTick />
      </IndicatorContext.Provider>
    );
  }

  baseRenderer.destroyAllWith(key);
  topRenderer.destroyAllWith(key);

  return null;
}
