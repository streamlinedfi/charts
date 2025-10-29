import React, { useState } from 'react';
import BacktestsModal from '../../../Modals/BacktestsModal';
import Text from '../../../Text';
import Div from '../../../Div';
import Table, { Table2 } from '../../../Table';
import Loader from '../../../Loader';
import theme from '../../../../modules/shared/theme';
import { GET_SYMBOL_BACKTESTS } from '../../../../constants/queries/symbol';
import useRetryQuery2 from '../../../../hooks/useRetryQuery2';

function formatTimePeriod(input) {
  return input.replace(/(\d+)([a-zA-Z]+)/, (match, num, period) => {
    // Capitalize the first letter of the period
    const capitalizedPeriod = period.charAt(0).toUpperCase() + period.slice(1);
    // Return formatted string
    return `${num} ${capitalizedPeriod}`;
  });
}

export default function Backtests({ context, onSelect }) {
  const [showModal, setShowModal] = useState(false);
  const [modalProps, setModalProps] = useState({});

  const result = useRetryQuery2(
    GET_SYMBOL_BACKTESTS,
    {
      variables: {
        symbol: 'SPY',
      },
    },
    [],
  );

  const isLoading = result.loading;
  const data = (result.data?.symbolBacktests || []).filter(
    // backtest => backtest.timeframe === context.config.timeframe.id,
    backtest => backtest.timeframe === 'H1',
  );

  return (
    <>
      <BacktestsModal
        show={showModal}
        onClose={() => setShowModal(false)}
        {...modalProps}
      />
      {isLoading ? (
        <Div $mb={2}>
          <Loader $h={136} />
        </Div>
      ) : (
        <Table2
          $rightAlignFromN={2}
          $thStyles={{
            1: {
              $px$important: 1.25,
              $borderBottom: `1px solid ${theme.fill300}`,
            },
            2: {
              $px$important: 1.25,
              $borderBottom: `1px solid ${theme.fill300}`,
            },
          }}
          $tdStyles={{ 1: { $px$important: 1 }, 2: { $px$important: 1 } }}
        >
          <thead>
            <tr>
              <th>Backtest Time Period</th>
              <th>Optimized Setting</th>
            </tr>
          </thead>
          <tbody>
            {data.map(({ period, topResult }) => (
              <tr>
                <td>
                  <Div $flex $w="auto" $spaceBetween>
                    <Text>{formatTimePeriod(period)}</Text>
                    <Text as="button" $color={500}>
                      View Results
                    </Text>
                  </Div>
                </td>
                <td>
                  <Text
                    as="button"
                    $color="blue800"
                    onClick={() => {
                      const {
                        fastLength,
                        slowLength,
                        signalLineLength,
                        signalThreshold,
                      } = topResult;

                      onSelect({
                        fastLength,
                        slowLength,
                        signalLineLength,
                        signalThreshold,
                      });
                    }}
                  >
                    {topResult.fastLength}, {topResult.slowLength},{' '}
                    {topResult.signalLineLength}, {topResult.signalThreshold}
                  </Text>
                </td>
              </tr>
            ))}
          </tbody>
        </Table2>
      )}
    </>
  );
}
