import { useEffect } from 'react';
import last from 'lodash/last';
import useContext from '../../modules/useContext';
import indicatorWindowInfo from '../../renderers/indicatorWindowInfo';
import { useIndicatorContext } from './_module';

export default function InfoWindow() {
  const { dispatch, config } = useContext();
  const {
    topRenderer: renderer,
    key,
    indicator,
    indicatorFrame,
    series,
  } = useIndicatorContext();
  const infoKey = `${key}.infoWindow`;

  if (series.length) {
    // const breakpoint = 640;

    // if (config.width >= breakpoint) {
    const render = value =>
      renderer(indicatorWindowInfo, {
        key: infoKey,
        indicatorFrame,
        indicator,
        value,
      });

    render(last(series).value);
    dispatch.on(`candle.${infoKey}`, candle => {
      render(
        series.find(entry => entry.i === candle?.i)?.value ||
          last(series).value,
      );
    });
    // } else {
    //   renderer.destroy(infoKey);
    //   dispatch.on(`candle.${infoKey}`, null);
    // }
  }

  useEffect(() => {
    return () => {
      renderer.destroy(infoKey);
      dispatch.on(`candle.${infoKey}`, null);
    };
  }, []);

  return null;
}
