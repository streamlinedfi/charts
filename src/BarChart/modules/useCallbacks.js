import { useRef } from 'react';

const { values, keys } = Object;

/**
 * useCallbacks
 * @returns [on,dispatch]
 */
function useCallbacks() {
  const callbacks = useRef({});
  const dispatch = (event, payload) => {
    values(callbacks.current[event] || [])
      .filter(fn => typeof fn === 'function')
      .forEach(fn => fn(payload));
  };
  const on = (event, callback, id) => {
    const key = id || keys(callbacks.current).length;
    callbacks.current[event] = {
      ...callbacks.current[event],
      [key]: callback,
    };
  };
  const off = (event, id) => {
    delete callbacks.current[event][id];
  };
  return [dispatch, on, off];
}

export default useCallbacks;
