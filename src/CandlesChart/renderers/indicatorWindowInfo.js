import Konva from 'konva';
import round from 'lodash/round';
import { transparentize } from 'polished';
import { Indicators } from '../modules/indicators';

const textMapping = {
  [Indicators.RSI]: 'RSI',
  [Indicators.ATR]: 'ATR',
  [Indicators.MACD]: 'MACD',
};

const settingsMapping = {
  [Indicators.RSI]: indicator => indicator.length,
  [Indicators.ATR]: indicator => indicator.length,
  [Indicators.STO]: indicator =>
    [indicator.kLength, indicator.kSmoothing, indicator.dSmoothing].join(' '),
  [Indicators.ROC]: indicator => indicator.length,
  [Indicators.MACD]: indicator =>
    [
      indicator.fastLength,
      indicator.slowLength,
      indicator.signalLineLength,
      // indicator.signalThreshold,
    ].join(' '),
};

function renderIndicatorWindowInfo({
  config,
  indicator,
  indicatorFrame,
  value,
}) {
  const indicatorAttrs = {
    fontFamily: config.theme.fontFamily,
    fontStyle: config.theme.fontStyle,
    fontSize: config.theme.axes.fontSize,
    text: textMapping[indicator.indicator] || indicator.indicator,
    fill: config.theme.indicatorWindow.color,
    x: indicatorFrame.xStart,
    y: indicatorFrame.yStart + 16,
    offsetY: config.theme.axes.fontSize / 2,
    perfectDrawEnabled: false,
  };

  const indicatorTextWidth = new Konva.Text(indicatorAttrs).getTextWidth();

  const settingsAttrs = {
    ...indicatorAttrs,
    text: settingsMapping[indicator.indicator](indicator),
    fill: config.theme.indicatorWindow.settingsColor,
    x: indicatorAttrs.x + indicatorTextWidth + 8,
  };
  const settingsTextWidth = new Konva.Text(settingsAttrs).getTextWidth();

  const windowInfo = [
    {
      type: 'Rect',
      attrs: {
        x: indicatorFrame.xStart,
        y: indicatorFrame.yStart + 16 - config.theme.fontSize / 2,
        width: indicatorTextWidth + settingsTextWidth + 8,
        height: config.theme.fontSize,
        fill: transparentize(0.25, config.theme.indicatorWindow.bgColor),
        cornerRadius: [0, 8, 8, 0],
      },
    },
    {
      type: 'Text',
      attrs: indicatorAttrs,
    },
    {
      type: 'Text',
      attrs: settingsAttrs,
    },
    {
      type: 'Text',
      attrs: {
        ...settingsAttrs,
        text: round(value, 2),
        fill: indicator.color,
        x: settingsAttrs.x + settingsTextWidth + 8,
      },
    },
  ];

  return windowInfo;
}

export default renderIndicatorWindowInfo;
