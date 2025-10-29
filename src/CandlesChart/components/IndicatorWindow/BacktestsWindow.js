import React, { useRef, useState } from 'react';
import { Html } from 'react-konva-utils';
import { transparentize } from 'polished';
import { Layer } from '../konva';
import External from '../../assets/external.svg';
import useContext from '../../modules/useContext';
import arrayReplace from '../../../../modules/shared/arrayReplace';
import useSize from '../../../../hooks/useSize';
import BacktestsModal from '../../../Modals/BacktestsModal';
import { useIndicatorContext } from './_module';
import Div from '../../../Div';
import Text from '../../../Text';

export default function BacktestsWindow() {
  const { config, setConfig } = useContext();
  const { indicatorFrame } = useIndicatorContext();
  const ref = useRef();
  const [, height] = useSize(ref);
  const [showModal, setShowModal] = useState(false);

  const setParams = params =>
    setConfig({
      ...config,
      indicators: {
        ...config.indicators,
        windows: arrayReplace(
          config.indicators.windows,
          ic => ic.indicator === 'MACD',
          ic => ({
            ...ic,
            ...params,
            type: 'SMA',
          }),
        ),
      },
    });

  const indicatorConfig = config.indicators.windows.find(
    ic => ic.indicator === 'MACD',
  );

  return (
    <Layer>
      <Html divProps={{ style: { width: '100%' } }}>
        <BacktestsModal
          show={showModal}
          onClose={() => setShowModal(false)}
          symbol={config.symbol.code}
          timeframe={config.timeframe.id}
          onSelect={params => {
            setParams(params);
            setShowModal(false);
          }}
        />
        <Div
          ref={ref}
          $flex
          $innerCenter
          $w="auto"
          $absolute
          $top={indicatorFrame.yEnd - height}
          $left={indicatorFrame.xStart}
          $background={transparentize(0.25, config.theme.theme.background)}
          $borderRadius={4}
        >
          <Text $color={config.theme.theme.fill600} $size={13} $mr={0.5}>
            Ai
          </Text>
          {[...config.backtests]
            .sort((a, b) => {
              const order = ['6months', '1year', '2years'];
              return order.indexOf(a.period) - order.indexOf(b.period);
            })
            .map(backtest => (
              <Text
                key={backtest.id}
                as="button"
                $size={13}
                $color={
                  Object.entries(backtest.params).every(
                    ([key, value]) => value === indicatorConfig[key],
                  )
                    ? config.theme.theme.fill700
                    : config.theme.theme.fill500
                }
                $mr={0.25}
                onClick={() => setParams(backtest.params)}
              >{`${backtest.periodLength}${backtest.periodUnit
                .slice(0, 1)
                .toUpperCase()}`}</Text>
            ))}
          <Div
            as="button"
            $color={config.theme.theme.fill500}
            $hover={config.theme.theme.fill700}
            onClick={() => setShowModal(true)}
          >
            <Div as={External} $relative $top={1} />
          </Div>
        </Div>
      </Html>
    </Layer>
  );
}
