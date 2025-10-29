import { useEffect, useRef } from 'react';
import { disableScroll, enableScroll } from './preventScroll';
import onVisibilityChange from './visibilityChange';

export default function useKey() {
  const keyRef = useRef();

  // useEffect(() => {
  //   function keyDown(event) {
  //     disableScroll();
  //     keyRef.current = event;
  //   }
  //   function keyUp() {
  //     enableScroll();
  //     keyRef.current = null;
  //   }
  //   document.body.addEventListener('keydown', keyDown);
  //   document.body.addEventListener('keyup', keyUp);
  //   onVisibilityChange(keyUp);
  //   return () => {
  //     document.body.removeEventListener('keydown', keyDown);
  //     document.body.removeEventListener('keyup', keyUp);
  //     // document.removeEventListener('visibilitychange', keyUp);
  //   };
  // }, []);

  return keyRef;
}
