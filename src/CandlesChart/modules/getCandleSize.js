import last from 'lodash/last';

export const minCandleMargin = 1;

export default function getCandleSize(xScale) {
  const stepWidth =
    (last(xScale.range()) - xScale.range()[0]) /
    (last(xScale.domain()) - xScale.domain()[0]);

  let margin = minCandleMargin;
  let wickWidth = 1;
  if (stepWidth > 10) {
    wickWidth = 2;
    margin = 3;
  } else if (stepWidth > 5) {
    wickWidth = 1.5;
    margin = 2;
  } else if (stepWidth > 2.5) {
    margin = 1;
  }
  const candleWidth = stepWidth - margin;

  return {
    width: candleWidth,
    margin,
    wickWidth,
  };
}
