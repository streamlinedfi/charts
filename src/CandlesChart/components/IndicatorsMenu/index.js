import Div from '@streamlinedfi/div';
import React from 'react';
import { createPortal } from 'react-dom';
import { Screens } from '../../modules/indicators';
import Popover from '../react/Popover';
import ATR from './ATR';
import BB from './BB';
import Indicators from './Indicators';
import MACD from './MACD';
import MovingAverage from './MovingAverage';
import ROC from './ROC';
import RSI from './RSI';
import STO from './STO';

const screenComponentMapping = {
  [Screens.Indicators]: Indicators,
  [Screens.MA]: MovingAverage,
  [Screens.RSI]: RSI,
  [Screens.ATR]: ATR,
  [Screens.STO]: STO,
  [Screens.MACD]: MACD,
  [Screens.BB]: BB,
  [Screens.ROC]: ROC,
};

export default function IndicatorsPopover({
  floating,
  strategy,
  x,
  y,
  context,
  onOutsideClick,
}) {
  const { config } = context;

  const Screen =
    screenComponentMapping[
      config.indicators.currentScreen || Screens.Indicators
    ];

  return (
    typeof window !== 'undefined' &&
    createPortal(
      <Div
        $fixed
        $cover
        $z={config.theme.popoverMenu.zIndex - 1}
        onClick={onOutsideClick}
      >
        <Div
          ref={floating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            width: 360,
          }}
        >
          <Popover
            y="bottom"
            x="center"
            yOffset={12}
            $w={360}
            onOutsideClick={onOutsideClick}
          >
            <Screen context={context} />
          </Popover>
        </Div>
      </Div>,
      document.getElementById('streamlined-container'),
    )
  );
}
