/* eslint-disable no-underscore-dangle */
import { useEffect } from 'react';
import useContext from './useContext';
import useScales from './useScales';

export default function useZoomDispatch() {
  const { config, data, dispatch } = useContext();
  const scales = useScales('candleDispatcher');

  useEffect(() => {
    if (data.series) {
      const dataSeries = Object.fromEntries(
        data.series.map(entry => [entry.i, entry]),
      );

      scales.onChange(() => {
        dispatch.on('mousemove.candleDispatcher', event => {
          if (event?.offsetX) {
            const value = Math.floor(scales.x.invert(event.offsetX));
            const candle =
              value < data.series[0].i ? data.series[0] : dataSeries[value];
            dispatch.call('candle', null, candle);
          } else {
            dispatch.call('candle', null, null);
          }
        });
      });
    }
  }, [dispatch, data.seriesId]);
}
