import { ATR, EMA, RSI, SMA, Stochastic } from '@debut/indicators';
import React, { useContext as useReactContext } from 'react';
import { Indicators } from '../../modules/indicators';
import renderATR from '../../renderers/atr';
import renderMACD from '../../renderers/macd';
import renderROC from '../../renderers/roc';
import renderRSI from '../../renderers/rsi';
import renderStochastic from '../../renderers/stochastic';

function getRsiSeries(data, indicator) {
  if (!data.series) {
    return [];
  }
  const rsi = new RSI(Number(indicator.length));
  return data.series?.map(entry => {
    return {
      i: entry.i,
      value: rsi.nextValue(entry.close),
    };
  });
}

function getAtrSeries(data, indicator) {
  if (!data.series) {
    return [];
  }
  const atr = new ATR(Number(indicator.length), 'SMA');
  return data.series?.map(entry => {
    return {
      i: entry.i,
      value: atr.nextValue(entry.high, entry.low, entry.close),
    };
  });
}

// Add after imports at the top
function getRocSeries(data, indicator) {
  if (!data.series) {
    return [];
  }

  const length = Number(indicator.length);

  return data.series
    .map((entry, i) => {
      if (i < length) {
        return null;
      }

      const currentPrice = entry.close;
      const pastPrice = data.series[i - length].close;
      const roc = ((currentPrice - pastPrice) / pastPrice) * 100;

      return {
        i: entry.i,
        value: roc,
      };
    })
    .filter(Boolean);
}

function getStoSeries(data, indicator) {
  if (!data.series) {
    return [];
  }
  const smaHigh = new SMA(Number(indicator.kSmoothing));
  const smaLow = new SMA(Number(indicator.kSmoothing));
  const smaClose = new SMA(Number(indicator.kSmoothing));
  const stochastic = new Stochastic(
    Number(indicator.kLength),
    Number(indicator.dSmoothing),
  );

  return data.series
    ?.map(entry => {
      const high = smaHigh.nextValue(entry.high);
      const low = smaLow.nextValue(entry.low);
      const close = smaClose.nextValue(entry.close);

      if (close) {
        const { k, d } = stochastic.nextValue(high, low, close) || {};

        return {
          i: entry.i,
          values: {
            k,
            d,
          },
        };
      }
    })
    .filter(Boolean);
}

function getMacdSeries(data, indicator) {
  if (!data.series) {
    return [];
  }
  const MA = indicator.type === 'SMA' ? SMA : EMA;
  const fastMA = new MA(Number(indicator.fastLength));
  const slowMA = new MA(Number(indicator.slowLength));
  const signalMA = new SMA(Number(indicator.signalLineLength));

  return data.series
    ?.map(entry => {
      const emaFast = fastMA.nextValue(entry.close);
      const emaSlow = slowMA.nextValue(entry.close);
      if (!emaSlow || !emaFast) {
        return;
      }
      const macd = emaFast - emaSlow;
      const signal = (macd && signalMA.nextValue(macd)) || undefined;
      const histogram = macd - signal || undefined;

      if (Number.isNaN(macd)) {
        return;
      }

      // eslint-disable-next-line consistent-return
      return {
        i: entry.i,
        values: {
          macd,
          emaFast,
          emaSlow,
          signal,
          histogram,
        },
      };
    })
    .filter(Boolean);
}

export const seriesMapping = {
  [Indicators.RSI]: getRsiSeries,
  [Indicators.ATR]: getAtrSeries,
  [Indicators.STO]: getStoSeries,
  [Indicators.MACD]: getMacdSeries,
  [Indicators.ROC]: getRocSeries,
};

export const renderMapping = {
  [Indicators.RSI]: renderRSI,
  [Indicators.ATR]: renderATR,
  [Indicators.STO]: renderStochastic,
  [Indicators.MACD]: renderMACD,
  [Indicators.ROC]: renderROC,
};

const getNiceTicks = (scaleY, { config, frame, indicatorFrame }) => {
  return scaleY
    .copy()
    .nice()
    .ticks()
    .reverse()
    .reduce(
      (ref, tick, i) => {
        const y = scaleY(tick);
        if (
          (i > 0 && y > ref.yEnd - config.theme.axes.minTickSpaceY) ||
          y > indicatorFrame.yEnd - config.theme.axes.fontSize / 2 ||
          y < indicatorFrame.yStart + config.theme.axes.fontSize / 2
        ) {
          return ref;
        }

        return {
          yEnd: y - config.theme.axes.fontSize,
          ticks: [
            ...ref.ticks,
            {
              value: tick,
              y,
            },
          ],
        };
      },
      {
        yEnd: frame.mainInner.yEnd,
        ticks: [],
      },
    ).ticks;
};

export const ticksMapping = {
  [Indicators.RSI]: (scaleY, { indicator }) => [
    {
      value: indicator.upperLine,
      y: scaleY(indicator.upperLine),
    },
    {
      value: indicator.lowerLine,
      y: scaleY(indicator.lowerLine),
    },
  ],
  [Indicators.STO]: (scaleY, { indicator }) => [
    {
      value: indicator.upperLine,
      y: scaleY(indicator.upperLine),
    },
    {
      value: indicator.lowerLine,
      y: scaleY(indicator.lowerLine),
    },
  ],
  [Indicators.ATR]: getNiceTicks,
  [Indicators.MACD]: getNiceTicks,
  [Indicators.ROC]: getNiceTicks, // Add this
};

export const domainMapping = {
  [Indicators.RSI]: () => [100, 0],
  [Indicators.STO]: () => [100, 0],
  [Indicators.ATR]: series => [
    Math.ceil(Math.max(...series.map(entry => entry.value || 0))),
    0,
  ],
  [Indicators.ROC]: series => {
    const values = series.map(entry => entry.value || 0);
    const max = Math.max(...values);
    const min = Math.min(...values);
    return [Math.ceil(max), Math.floor(min)];
  },
  [Indicators.MACD]: series => {
    const domain = [
      Math.ceil(
        Math.max(
          ...series.flatMap(entry => [
            entry.values.histogram &&
            Math.abs(entry.values.histogram) !== Infinity
              ? entry.values.histogram
              : 0,
            entry.values.macd || 0,
          ]),
        ),
      ),
      Math.floor(
        Math.min(
          ...series.flatMap(entry => [
            entry.values.histogram &&
            Math.abs(entry.values.histogram) !== Infinity
              ? entry.values.histogram
              : 0,
            entry.values.macd || 0,
          ]),
        ),
      ),
    ];
    return domain;
  },
};

export const IndicatorContext = React.createContext();

export function useIndicatorContext() {
  return useReactContext(IndicatorContext);
}
