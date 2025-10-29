import React, { useRef } from 'react';
import { Layer } from './konva';
import useContext from '../modules/useContext';
import useScales from '../modules/useScales';
import useRenderer from '../modules/useRenderer';
import IndicatorWindow from './IndicatorWindow';

export default function IndicatorWindows() {
  const { config, frame } = useContext();
  const scales = useScales('indicatorWindows');
  const baseLayerRef = useRef();
  const topLayerRef = useRef();
  const baseRenderer = useRenderer(baseLayerRef.current);
  const topRenderer = useRenderer(topLayerRef.current);

  return (
    <>
      <Layer ref={baseLayerRef} />
      <Layer ref={topLayerRef} />
      {config.indicators.windows.map((indicator, i) => (
        <IndicatorWindow
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          i={i}
          indicator={indicator}
          indicatorFrame={frame.indicatorWindows.find(
            window => window.indicator === indicator.indicator,
          )}
          scales={scales}
          baseRenderer={baseRenderer}
          topRenderer={topRenderer}
        />
      ))}
    </>
  );
}
