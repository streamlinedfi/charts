import theme from '../../../modules/shared/theme';

export const Indicators = {
  MA: 'Moving Average',
  BB: 'Bollinger Bands',
  RSI: 'Relative Strength Index',
  STO: 'Stochastic',
  ATR: 'Average True Range',
  MACD: 'MACD',
  ROC: 'Rate of Change',
};

export const Screens = {
  Datawindow: 'Datawindow',
  Indicators: 'Indicators',
  ...Indicators,
};

export const defaultConfigs = {
  [Indicators.MA]: {
    indicator: Indicators.MA,
    active: true,
    length: 21,
    colorOptions: [0, 1, 2, 3, 4].map(c => theme.colorMap[c]),
    color: theme.colorMap[0],
    type: 'SMA',
    thickness: 1.5,
  },
  [Indicators.BB]: {
    indicator: Indicators.BB,
    active: false,
    length: 20,
    stdDev: 2,
    thickness: 1,
  },
  [Indicators.MACD]: {
    indicator: Indicators.MACD,
    active: false,
    order: 1,
    type: 'EMA',
    fastLength: 12,
    slowLength: 26,
    macdLineColor: theme.primary,
    signalLineLength: 8,
    signalLineColor: theme.red,
    // signalThreshold: 0,
    // colorOptions: [0, 1, 2, 3, 4].map(c => theme.colorMap[c]),
    // color: theme.colorMap[0],
    thickness: 1,
    defaultHeight: 72,
  },
  [Indicators.RSI]: {
    indicator: Indicators.RSI,
    active: false,
    order: 2,
    length: 14,
    colorOptions: [0, 1, 2, 3, 4].map(c => theme.colorMap[c]),
    color: theme.colorMap[0],
    thickness: 1.5,
    upperLine: 70,
    lowerLine: 30,
    defaultHeight: 72,
  },
  [Indicators.ATR]: {
    indicator: Indicators.ATR,
    active: false,
    order: 3,
    length: 7,
    colorOptions: [0, 1, 2, 3, 4].map(c => theme.colorMap[c]),
    color: theme.colorMap[0],
    thickness: 1.5,
    defaultHeight: 72,
  },
  [Indicators.STO]: {
    indicator: Indicators.STO,
    active: false,
    order: 4,
    kLength: 4,
    kSmoothing: 3,
    dSmoothing: 3,
    kColor: theme.colorMap[0],
    dColor: theme.colorMap[3],
    upperLine: 80,
    lowerLine: 20,
    thickness: 1.5,
    defaultHeight: 72,
  },
  [Indicators.ROC]: {
    indicator: Indicators.ROC,
    active: false,
    order: 5, // Adjust order as needed
    length: 14, // Common default for ROC
    colorOptions: [0, 1, 2, 3, 4].map(c => theme.colorMap[c]),
    color: theme.colorMap[0],
    thickness: 1.5,
    defaultHeight: 72,
  },
};
