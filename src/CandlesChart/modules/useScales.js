import { useRef, useEffect, useState } from 'react';
import useContext from './useContext';

const { values } = Object;

export default function useScales(key) {
  const { dispatch } = useContext();
  const callbackRef = useRef({});
  const scaleRef = useRef({
    loaded: false,
    onChange: (fn, fnKey) => {
      callbackRef.current[fnKey || key] = fn;
    },
    offChange: fnKey => {
      delete callbackRef.current[fnKey || key];
    },
  });
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    dispatch.on(`scale.${key}`, scale => {
      if (scale.x) {
        scaleRef.current.x = scale.x;
        scaleRef.current.xBand = scale.xBand;
        scaleRef.current.xTicks = scale.xTicks;
      }

      if (scale.y) {
        scaleRef.current.y = scale.y;
        scaleRef.current.yTicks = scale.yTicks;
      }

      if (scaleRef.current.x && scaleRef.current.y) {
        if (!loaded) {
          scaleRef.current.loaded = true;
          setLoaded(true);
        }

        values(callbackRef.current).forEach(fn => {
          fn(scaleRef.current);
        });
      }
    });
  }, [dispatch]);

  return scaleRef.current;
}
