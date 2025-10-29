import React, { useRef, useState, useEffect } from 'react';
import { Layer } from './konva';
import useContext from '../modules/useContext';
import ChartCandles from './ChartCandles';
import ChartIndicators from './ChartIndicators';
import ChartVolumes from './ChartVolumes';

export default function InnerChart() {
  const { frame } = useContext();
  const layerRef = useRef();

  return (
    <Layer
      ref={layerRef}
      clipX={frame.mainChart.xStart}
      clipY={frame.mainChart.yStart}
      clipWidth={frame.mainChart.width}
      clipHeight={frame.mainChart.height}
    >
      <ChartIndicators layerRef={layerRef} />
      <ChartVolumes layerRef={layerRef} />
      <ChartCandles layerRef={layerRef} />
    </Layer>
  );
}
