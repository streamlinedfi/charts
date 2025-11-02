import { select } from 'd3-selection';
import { zoom } from 'd3';

export default function useZoom(canvas, scales, render) {
  const behavoir = zoom()
    .scaleExtent([0.1, 10])
    // .translateExtent([
    //   [-1, -1],
    //   [2, 2],
    // ])
    .wheelDelta(event => {
      if (event.deltaMode === 1) {
        return -event.deltaY * 0.05;
      }
      return -event.deltaY * event.deltaMode ? 1 : 0.002;
    })
    .on('zoom', ({ transform }) => {
      scales.forEach(scale => {
        scale.x = transform.rescaleX(scale.x);
        scale.y = transform.rescaleY(scale.y);
      });

      render();
    });

  select(canvas).call(behavoir);

  return behavoir;
}
