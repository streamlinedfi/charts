import last from 'lodash/last';
import map from 'lodash/map';
import reverse from 'lodash/reverse';
import { useEffect, useRef, useState } from 'react';

export function dataSeriesId(symbolCode, timeframeId, data) {
  return `${symbolCode}:${timeframeId}:${
    data?.length
      ? `${data[0].time}:${data[0].close}-${last(data).time}:${
          last(data).close
        }:${data.length}` // Add data length to make it more sensitive to changes
      : null
  }`;
}

export function timeSeriesId(symbolCode, timeframeId, data) {
  return `${symbolCode}:${timeframeId}:${
    data?.length ? `${data[0].time}-${last(data).time}:${data.length}` : null
  }`;
}

function indexSeries(
  nextDataSeries,
  dataState,
  initialCandlesWindow,
  symbolCode,
  timeframeId,
) {
  // shallow sorting
  const isAscendingSeries = nextDataSeries[0].time < last(nextDataSeries).time;
  const nextSeries = isAscendingSeries
    ? nextDataSeries
    : reverse(nextDataSeries);

  // proper sort
  // const nextSeries = nextDataSeries.sort((a, b) => {
  //   return new Date(a.time) - new Date(b.time);
  // });

  // the zero index is the initial zero
  // this is the x-ordinate for each candle on the chart
  // if we add data to the left, their index will be negative -3, -2, -1
  // etc and the zero index will shift to the right
  // let nextZeroIndex = dataState.zeroIndex ?? 0;

  // if (nextZeroIndex >= nextSeries.length) {
  //   nextZeroIndex = 0;
  // } else if (nextZeroIndex <= -1) {
  //   nextZeroIndex = 0;
  // } else if (
  //   nextSeries?.length &&
  //   dataState.series?.length &&
  //   nextSeries[nextZeroIndex].time < dataState.series[dataState.zeroIndex].time
  // ) {
  //   while (
  //     nextSeries[nextZeroIndex]?.time &&
  //     nextSeries[nextZeroIndex]?.time <
  //       dataState.series[dataState.zeroIndex].time
  //   ) {
  //     nextZeroIndex++;
  //   }
  // } else if (
  //   nextSeries?.length &&
  //   dataState.series?.length &&
  //   nextSeries[nextZeroIndex].time > dataState.series[dataState.zeroIndex].time
  // ) {
  //   while (
  //     nextSeries[nextZeroIndex]?.time &&
  //     nextSeries[nextZeroIndex]?.time >
  //       dataState.series[dataState.zeroIndex].time
  //   ) {
  //     nextZeroIndex--;
  //   }
  //   // tmp fix -- seems to happen while switching tfs with data from another tf.
  //   if (nextZeroIndex === -1) {
  //     nextZeroIndex = 0;
  //   }
  // }

  /* eslint-disable no-param-reassign */
  dataState.zeroIndex = Math.max(0, nextSeries.length - initialCandlesWindow);
  dataState.series = map(nextSeries, (entry, i) => ({
    i: i - dataState.zeroIndex,
    ...entry,
  }));
  dataState.seriesId = dataSeriesId(symbolCode, timeframeId, dataState.series);
  dataState.timeSeriesId = timeSeriesId(
    symbolCode,
    timeframeId,
    dataState.series,
  );
  dataState.scaleId = `${symbolCode}:${timeframeId}`;
  dataState.timeframe = timeframeId;
}

export default function useData(
  instanceData,
  initialCandlesWindow,
  symbolCode,
  timeframe,
  dispatch,
) {
  const dataBySymbolTfRef = useRef({});
  const [data, setData] = useState({
    zeroIndex: undefined,
    series: null,
    seriesId: undefined,
    timeframe: undefined,
  });

  useEffect(() => {
    if (instanceData?.length) {
      const symbolTfData = dataBySymbolTfRef.current;
      symbolTfData[symbolCode] = symbolTfData[symbolCode] || {};
      symbolTfData[symbolCode][timeframe.id] =
        symbolTfData[symbolCode][timeframe.id] || {};

      indexSeries(
        instanceData,
        symbolTfData[symbolCode][timeframe.id],
        initialCandlesWindow,
        symbolCode,
        timeframe.id,
      );

      setData({ ...symbolTfData[symbolCode][timeframe.id] });
    }
  }, [
    dataSeriesId(symbolCode, timeframe.id, instanceData),
    timeframe.id,
    dispatch,
  ]);

  return data;
}
