import { CandlesChart } from '@streamlinedfi/charts';
import Div from '@streamlinedfi/div';
import { useEffect, useState } from 'react';
import data from './data';

const { values } = Object;

const defaultRequestBars = 100;

const TimeFrames = {
  M1: 'M1',
  M3: 'M3',
  M5: 'M5',
  M10: 'M10',
  M15: 'M15',
  M20: 'M20',
  M30: 'M30',
  H1: 'H1',
  H2: 'H2',
  H4: 'H4',
  D1: 'D1',
  W1: 'W1',
};

const timeframes = {
  [TimeFrames.M15]: {
    text: '15m',
    id: TimeFrames.M15,
  },
  [TimeFrames.M30]: {
    text: '30m',
    id: TimeFrames.M30,
  },
  [TimeFrames.H1]: {
    text: '1h',
    id: TimeFrames.H1,
  },
  [TimeFrames.H4]: {
    text: '4h',
    id: TimeFrames.H4,
  },
  [TimeFrames.D1]: {
    text: 'D',
    id: TimeFrames.D1,
  },
  [TimeFrames.W1]: {
    text: 'W',
    id: TimeFrames.W1,
  },
};

function App() {
  const [loading, setLoading] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [timeframe, setTimeframe] = useState(timeframes.D1);
  const [config, setConfig] = useState({});

  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <Div $h="100%" $background={theme => theme.background} $flex $innerCenter>
      <CandlesChart
        loading={loading}
        config={{
          width: 960,
          height: 560,
          symbol: {
            name: 'S&P 500',
            code: 'SPY',
          },
          decimals: 2,
          symbolClick: true,
          fullscreen,
          showFullscreenButton: false,
          initialCandlesWindow: defaultRequestBars,
          timeframe,
          timeframes: values(timeframes),
          timeframesMenu: {
            Minute: [timeframes.M15, timeframes.M30],
            Hour: [timeframes.H1, timeframes.H4],
            'Day/Week': [timeframes.D1, timeframes.W1],
          },
        }}
        data={data}
        onConfig={setConfig}
        onTimeframeChange={setTimeframe}
        onLoadMore={() => {
          console.log('load more');
        }}
        onSymbolClick={() => {
          alert('symbol clicked!');
        }}
        onFullscreen={setFullscreen}
      />
    </Div>
  );
}

export default App;
