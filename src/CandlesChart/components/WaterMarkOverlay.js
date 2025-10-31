import { transparentize } from 'polished';
import React from 'react';
import useImage from 'use-image';
import logoSvg from '../assets/logo-chart.inline';
import useContext from '../modules/useContext';
import { Image, Layer, Rect } from './konva';

function WaterMarkOverlay({ loading }) {
  const { frame, config } = useContext();
  const [image, status] = useImage(logoSvg);

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
