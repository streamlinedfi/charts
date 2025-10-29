/* eslint-disable no-unused-expressions */
/* eslint-disable no-inner-declarations */
/* eslint-disable no-underscore-dangle */
import { mean } from 'd3-array';
import { create, pointers, select } from 'd3-selection';
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import inRange from 'lodash/inRange';
import { useEffect, useRef } from 'react';
import useContext from './useContext';
import useKeyRef from './useKey';
import useScales from './useScales';

const jstr = JSON.stringify;

// sometimes the width jumps between 701 and 702,
// while we dont want to trigger a re-render
// so we round the width to the nearest multiple of 5
function roundInts(obj, roundTo = 20) {
  const nextObj = { ...obj };

  // Round all numeric values in the object
  Object.keys(nextObj).forEach(key => {
    if (typeof nextObj[key] === 'number') {
      nextObj[key] = Math.round(nextObj[key] / roundTo) * roundTo;
    }
  });

  return nextObj;
}

export default function useZoomDispatch(ref) {
  const { config, data, frame, dispatch } = useContext();
  const toolRef = useRef();
  const drawingRef = useRef();
  const zoomRef = useRef(zoomIdentity);
  const scales = useScales('zoomDispatch');
  const keyRef = useKeyRef();
  toolRef.current = config.tool;
  const canvas = ref.current?.getCanvas();

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (canvas && data.seriesId && scales.loaded) {
      const canvasSelection = select(canvas._canvas);
      canvasSelection.interrupt = () => canvasSelection;

      // shadow doms
      const svg = create('svg').attr('viewBox', [
        frame.mainInner.xStart,
        frame.mainInner.yStart,
        frame.mainInner.width,
        frame.mainInner.height,
      ]);
      const gx = svg.append('g');
      const gy = svg.append('g');
      gx.interrupt = () => gx;
      gy.interrupt = () => gy;

      // from: https://observablehq.com/@d3/x-y-zoom
      const zoomX = zoom()
        .scaleExtent([0.1, 10])
        .on('zoom', zoomEvent => {
          dispatch.call('zoomX', null, zoomEvent.transform);
        });
      const zoomY = zoom()
        .scaleExtent([0.2, 5])
        .on('zoom', zoomEvent => {
          dispatch.call('zoomY', null, zoomEvent.transform);
        });
      const tx = () => zoomTransform(gx.node());
      const ty = () => zoomTransform(gy.node());

      // center the action (handles multitouch)
      function center(event) {
        if (event.sourceEvent) {
          const p = pointers(event, event.sourceEvent.target);
          return [mean(p, d => d[0]), mean(p, d => d[1])];
        }
        return [frame.mainInner.width / 2, frame.mainInner.height / 2];
      }

      const zoomBehavior = zoom()
        .filter(event => {
          return (
            toolRef.current === 'crosshair' &&
            !drawingRef.current &&
            (event.type !== 'wheel' || keyRef.current?.metaKey) &&
            inRange(
              event.offsetX,
              frame.mainInner.xStart,
              frame.mainInner.xEnd,
            ) &&
            inRange(event.offsetY, frame.mainInner.yStart, frame.mainInner.yEnd)
          );
        })
        .on('zoom', zoomEvent => {
          const z = zoomRef.current;
          const t = zoomEvent.transform;
          const k = t.k / z.k;
          const point = center(zoomEvent, this);

          const doX = ['mousemove', 'dragX', 'dblclick', 'wheel'].includes(
            zoomEvent.sourceEvent?.type,
          );
          const doY = ['mousemove', 'dragY'].includes(
            zoomEvent.sourceEvent?.type,
          );

          if (k === 1) {
            // pure translation?
            doX && gx.call(zoomX.translateBy, (t.x - z.x) / tx().k, 0);
            doY && gy.call(zoomY.translateBy, 0, (t.y - z.y) / ty().k);
          } else {
            // if not, we're zooming on a fixed point
            doX && gx.call(zoomX.scaleBy, k, point);
            doY && gy.call(zoomY.scaleBy, k, point);
          }

          zoomRef.current = t;
        });

      const resetZoom = zoomIdentity => {
        canvasSelection.call(zoomBehavior.transform, zoomIdentity);
        gx.call(zoomX.transform, zoomIdentity);
        gy.call(zoomY.transform, zoomIdentity);
      };
      resetZoom(zoomIdentity);

      canvasSelection.call(zoomBehavior);

      dispatch.on('dragX.zoom', ({ evt, dx }) => {
        const k = 1 - dx / (frame.xAxis.width / 2);
        canvasSelection.call(zoomBehavior.scaleBy, k, null, {
          sourceEvent: evt,
          type: 'dragX',
        });
      });

      dispatch.on('dragY.zoom', ({ evt, dy }) => {
        const k = 1 - dy / frame.yAxis.height;
        canvasSelection.call(zoomBehavior.scaleBy, k, null, {
          sourceEvent: evt,
          type: 'dragY',
        });
      });

      dispatch.on('hoverDrawing.zoom', drawing => {
        drawingRef.current = drawing;
      });

      dispatch.on('resetZoom.zoom', () => resetZoom(zoomIdentity));

      return () => {
        zoomBehavior.on('zoom', null);
      };
    }
  }, [
    !!canvas,
    jstr(frame.mainInner),
    data.scaleId,
    scales.loaded,
    !!zoomRef.current,
  ]);
}
