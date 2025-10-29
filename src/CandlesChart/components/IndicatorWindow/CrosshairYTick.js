import inRange from 'lodash/inRange';
import useContext from '../../modules/useContext';
import renderActiveYTick from '../../renderers/activeYTick';
import { useIndicatorContext } from './_module';

export default function CrosshairYTick() {
  const { dispatch, config } = useContext();
  const {
    topRenderer: renderer,
    key,
    yScale,
    indicatorFrame,
    series,
  } = useIndicatorContext();

  if (series.length) {
    dispatch.on(`mousemove.${key}`, event => {
      const tickKey = `${key}.yTick`;
      if (
        event &&
        inRange(event.offsetY, indicatorFrame.yStart, indicatorFrame.yEnd)
      ) {
        renderer(renderActiveYTick, {
          key: tickKey,
          x: event.offsetX,
          y: event.offsetY,
          fill: config.theme.crosshair.color,
          text: config.formatters.crosshair.y(yScale?.invert(event.offsetY)),
        });
      } else {
        renderer.destroy(tickKey);
      }
    });
  }

  return null;
}
