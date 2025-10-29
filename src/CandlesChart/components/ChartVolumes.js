import React, { useEffect } from 'react';
import { transparentize } from 'polished';
import forEach from 'lodash/forEach';
import last from 'lodash/last';
import maxBy from 'lodash/maxBy';
import filter from 'lodash/filter';
import inRange from 'lodash/inRange';
import useContext from '../modules/useContext';
import useRenderer from '../modules/useRenderer';
import useScales from '../modules/useScales';
import { minCandleMargin } from '../renderers/candle';

const jstr = JSON.stringify;

function renderVolumeBar({ frame, x, height, stepWidth, color }) {
  let margin = minCandleMargin;
  if (stepWidth > 10) {
    margin = 3;
  } else if (stepWidth > 5) {
    margin = 2;
  } else if (stepWidth > 2.5) {
    margin = 1;
  }
  const candleWidth = Math.max(stepWidth - margin, 0.5);
  const y = frame.mainChart.yEnd - height;

  return [
    {
      type: 'Rect',
      attrs: {
        x: x + margin / 2,
        y,
        width: candleWidth,
        height,
        fill: transparentize(0.75, color),
        transformsEnabled: 'position',
        perfectDrawEnabled: false,
        listening: false,
      },
    },
  ];
}

export default function ChartVolumes({ layerRef }) {
  const { frame, data, config } = useContext();
  const renderer = useRenderer(layerRef.current);
  const scales = useScales('volumes');

  useEffect(() => {
    if (data.series?.[0].volume) {
      const renderVolumes = () => {
        if (!scales.loaded) return;

        const maxHeight = frame.mainChart.height * 0.2; // 20%
        const maxVolume =
          maxBy(
            filter(data.series, entry =>
              inRange(entry.i, ...scales.x.domain()),
            ),
            'volume',
          )?.volume || 0;

        const stepWidth =
          (last(scales.x.range()) - scales.x.range()[0]) /
          (last(scales.x.domain()) - scales.x.domain()[0]);

        forEach(data.series, ({ i, close, open, volume }) => {
          const x = scales.x(i);

          renderer(renderVolumeBar, {
            key: i,
            show: inRange(
              x,
              frame.mainChart.xStart - stepWidth,
              frame.mainChart.xEnd + stepWidth,
            ),
            x,
            stepWidth,
            height: (volume / maxVolume) * maxHeight,
            color:
              close >= open
                ? config.theme.candleUpColor
                : config.theme.candleDownColor,
          });
        });
      };

      renderVolumes();
      scales.onChange(renderVolumes);
    }

    return () => {
      renderer.destroyAll();
    };
  }, [
    data.seriesId,
    scales.loaded,
    config.timeframe.id,
    jstr(frame.mainChart),
  ]);
}
