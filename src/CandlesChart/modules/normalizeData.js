import moment from 'moment';
import map from 'lodash/map';
import last from 'lodash/last';
import reverse from 'lodash/reverse';

export default function normalizeData(data, initialLength) {
  if (
    !data ||
    !data.length ||
    !['time', 'open', 'high', 'low', 'close'].every(key =>
      Object.keys(data[0]).includes(key),
    )
  ) {
    return {
      error: 'Invalid data',
      series: [
        {
          i: 0,
          time: moment()
            .subtract(1, 'day')
            .valueOf(),
          open: 60,
          high: 70,
          low: 10,
          close: 20,
        },
        {
          i: 1,
          time: new Date().getTime(),
          open: 30,
          high: 90,
          low: 20,
          close: 80,
        },
      ],
    };
  }

  const isAscendingSeries = data[0].time < last(data).time;
  const sort = isAscendingSeries ? v => v : reverse;

  return {
    error: null,
    data: map(sort(data), (entry, i) => ({
      i: initialLength - data.length + i,
      ...entry,
    })),
  };
}
