/* eslint-disable consistent-return */
import { scaleLinear } from 'd3-scale';
import { zoomIdentity } from 'd3-zoom';
import debounce from 'lodash/debounce';
import flatMap from 'lodash/flatMap';
import last from 'lodash/last';
import reduce from 'lodash/reduce';
import throttle from 'lodash/throttle';
import { useEffect, useMemo, useRef } from 'react';
import getNiceTimeTicks from './getNiceTimeTicks';
import useContext from './useContext';

const jstr = JSON.stringify;

// sometimes the width jumps between 701 and 702,
// while we dont want to trigger a re-render
// so we round the width to the nearest multiple of 5

// sometimes the width jumps between 701 and 702,
// while we dont want to trigger a re-render
// so we round the width to the nearest multiple of 5
function roundInts(obj, roundTo = 5) {
  const nextObj = { ...obj };

  // Round all numeric values in the object
  Object.keys(nextObj).forEach(key => {
    if (typeof nextObj[key] === 'number') {
      nextObj[key] = Math.round(nextObj[key] / roundTo) * roundTo;
    }
  });

  return nextObj;
}

export function getXScaleTransformer(config, data, frame) {
  if (!data.series) return;

  const scale = scaleLinear()
    .domain([
      0,
      (data.series.length - data.zeroIndex) * config.theme.axes.xEndShiftRatio,
    ])
    .range([frame.xAxis.xStart, frame.xAxis.xEnd]);

  const timeScale = scaleLinear()
    .domain(
      data.series?.length
        ? [data.series[data.zeroIndex].time, last(data.series).time]
        : [],
    )
    .range([frame.xAxis.xStart, frame.xAxis.xEnd]);

  const transformer = transform => {
    const xScale = transform.rescaleX(scale);
    const xTimeScale = transform.rescaleX(timeScale);
    const xTicks = getNiceTimeTicks(config, data, xScale, xTimeScale);

    return {
      x: xScale,
      xTime: xTimeScale,
      xTicks,
    };
  };

  return {
    key: [frame.xAxis.xEnd, frame.xAxis.xStart, data.timeSeriesId].join(':'),
    transformer,
  };
}

export function getYScaleTransformer(config, data, frame) {
  if (!data.series) return;

  const datapoints = flatMap(
    data.series.slice(data.zeroIndex),
    ({ open, high, low, close }) => [open, high, low, close],
  );

  const scale = scaleLinear()
    .domain([Math.min(...datapoints), Math.max(...datapoints)])
    .range([frame.yAxis.yEnd, frame.yAxis.yStart])
    .nice();

  const transformer = transform => {
    const yScale = transform.rescaleY(scale);

    const yTicks = reduce(
      yScale
        .copy()
        .nice()
        .ticks(),
      (ref, tick, i) => {
        const y = yScale(tick);
        if (i > 0 && y > ref.yEnd - config.theme.axes.minTickSpaceY) {
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
        yEnd: frame.mainChart.yEnd,
        ticks: [],
      },
    ).ticks;

    return {
      y: yScale,
      yTicks,
    };
  };

  return {
    key: [frame.yAxis.yEnd, frame.yAxis.yStart, data.scaleId].join(':'),
    transformer,
  };
}

export function useXScaleDispatch() {
  const { frame, config, data, dispatch } = useContext();
  const transformRef = useRef(zoomIdentity);
  const transformScale = useMemo(
    () => getXScaleTransformer(config, data, frame),
    [data.timeSeriesId, jstr(frame.xAxis)],
  );
  const { key, transformer } = transformScale || {};

  useEffect(() => {
    if (data.seriesId) {
      dispatch.call('scale', null, transformer(transformRef.current));

      dispatch.on('zoomX.xAxis', transform => {
        transformRef.current = transform;
        dispatch.call('scale', null, transformer(transformRef.current));
      });
    }
  }, [dispatch, key]);

  useEffect(() => {
    if (key) {
      dispatch.call('scale', null, transformer(transformRef.current));
    }
  }, [key, transformer]);
}

export function useYScaleDispatch() {
  const { frame, config, data, dispatch } = useContext();
  const transformRef = useRef(zoomIdentity);
  const transformScale = useMemo(
    () => getYScaleTransformer(config, data, frame),
    [data.scaleId, jstr(frame)],
  );
  const { key, transformer } = transformScale || {};

  useEffect(() => {
    if (data.series) {
      dispatch.call('scale', null, transformer(transformRef.current));

      dispatch.on(
        'zoomY.yAxis',
        throttle(transform => {
          transformRef.current = transform;
          dispatch.call('scale', null, transformer(transformRef.current));
        }, 50),
      );
    }
  }, [dispatch, key]);

  useEffect(() => {
    if (key) {
      dispatch.call('scale', null, transformer(transformRef.current));
    }
  }, [key, transformer]);
}

export function useOnLoadMore(onLoadMore) {
  const { frame, config, data, dispatch } = useContext();

  useEffect(() => {
    if (data.series && typeof onLoadMore === 'function') {
      let extraBarsToLoad = 0;
      [...config.indicators.windows, ...config.indicators.mainChart]
        .filter(indicator => indicator.active)
        .forEach(indicator => {
          if (indicator.indicator === 'MACD') {
            extraBarsToLoad = Math.max(
              extraBarsToLoad,
              Number(indicator.slowLength) + Number(indicator.signalLineLength),
            );
          }
          if (
            [
              'Moving Average',
              'Bollinger Bands',
              'Relative Strength Index',
            ].includes(indicator.indicator)
          ) {
            extraBarsToLoad = Math.max(
              extraBarsToLoad,
              Number(indicator.length),
            );
          }
        });

      const debounceOnLoadMore = debounce(xScale => {
        const bars = xScale.invert(frame.mainChart.xStart);
        const barsToTheLeftNeeded = Math.abs(bars) + extraBarsToLoad;
        const barsToTheLeftAlreadyLoaded = Math.abs(data.series[0].i);
        const barsToLoad = Math.ceil(
          barsToTheLeftNeeded - barsToTheLeftAlreadyLoaded,
        );

        if (barsToLoad > 0) {
          onLoadMore(barsToLoad);
        }
      }, 500);

      dispatch.on(`scale.onLoadMore`, scale => {
        if (scale.x) {
          debounceOnLoadMore(scale.x);
        }
      });
    }
  }, [dispatch, onLoadMore, data.seriesId, jstr(config.indicators)]);
}
