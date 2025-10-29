import inRange from 'lodash/inRange';

export default function isInInnerChartRange(frame, x, y) {
  return (
    inRange(x, frame.mainChart.xStart, frame.mainChart.xEnd) &&
    inRange(y, frame.mainChart.yStart, frame.mainChart.yEnd)
  );
}
