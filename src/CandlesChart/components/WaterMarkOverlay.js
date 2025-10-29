import React, { useEffect, useRef } from 'react';
import { Layer, Image, Rect } from './konva';
import { transparentize } from 'polished';
import useImage from 'use-image';
import useContext from '../modules/useContext';

function WaterMarkOverlay({ loading }) {
  const { frame, config } = useContext();
  const [image, status] = useImage(
    '/assets/logo-chart.svg',
    'anonymous',
    'origin',
  );

  const imagePadding = 4;

  return (
    <Layer>
      {!(loading || status !== 'loaded' || config.width <= 416) && (
        <>
          <Rect
            x={frame.mainChart.xStart}
            y={frame.mainChart.yEnd - imagePadding * 3 - 28}
            width={103 + imagePadding}
            height={28 + imagePadding * 2}
            fill={transparentize(0.25, config.theme.bgColor)}
            cornerRadius={[0, 8, 8, 0]}
          />
          <Image
            x={frame.mainChart.xStart}
            y={frame.mainChart.yEnd - imagePadding * 2 - 28}
            width={103}
            height={28}
            image={image}
          />
        </>
      )}
    </Layer>
  );
}

export default WaterMarkOverlay;
