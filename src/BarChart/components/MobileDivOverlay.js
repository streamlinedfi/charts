import React from 'react';
import { Html } from 'react-konva-utils';
import useContext from '../modules/useContext';
import { Layer } from './konva';

export default function MobileDivOverlay() {
  const { config } = useContext();
  const isMobile =
    typeof window !== 'undefined' && typeof document !== 'undefined'
      ? document.body.clientWidth < config.mobileThreshold
      : false;

  // tmp solution to allow scrolling on mobile
  // touch seems to be prevented on canvas
  if (isMobile) {
    return (
      <Layer>
        <Html divProps={{ style: { zIndex: 1, width: '100%' } }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: config.width,
              height: config.height,
            }}
          />
        </Html>
      </Layer>
    );
  }

  return null;
}
