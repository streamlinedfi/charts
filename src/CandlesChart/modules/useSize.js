/* eslint-disable consistent-return */
import get from 'lodash/get';
import { useEffect, useState } from 'react';

// can be controlled using dep array or else use resize observer
export default function useSize(
  ref,
  dependencyArray = [],
  fallback = typeof window !== 'undefined' && document.body,
) {
  const [size, setSize] = useState({});

  useEffect(() => {
    let observer;

    const el = ref?.current || fallback;

    if (el) {
      setSize({
        width: el.clientWidth,
        height: el.clientHeight,
      });

      if (!dependencyArray.length) {
        observer = new ResizeObserver(entries => {
          // Wrap it in requestAnimationFrame to avoid this error - ResizeObserver loop limit exceeded
          requestAnimationFrame(() => {
            setSize({
              width: get(entries, '0.target.clientWidth', 0),
              height: get(entries, '0.target.clientHeight', 0),
            });
          });
        });

        observer.observe(el);
      }
    }

    return () => {
      if (observer) {
        observer.disconnect();
        observer = null;
      }
    };
  }, [ref?.current, ...dependencyArray]);

  return [size.width, size.height, size.breakpoints || {}];
}
