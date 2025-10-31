import { round as lodashRound } from 'lodash/round';

/* eslint-disable no-restricted-properties */
/**
 * Replacement for toFixed()
 *
 * toFixed falsely rounds the number:
 * > 1.0005.toFixed(3)
 * 1.000 // instead of 1.001
 *
 * @param {*} n
 * @returns
 */
function round(value, n, toFixed = true) {
  if (!value && value !== 0) {
    return null;
  }

  const roundedNo = lodashRound(value, n);
  if (toFixed) {
    return roundedNo.toFixed(n);
  }
  return roundedNo;
}

export default round;
