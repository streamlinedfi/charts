import map from 'lodash/map';

const isValidOrdinate = value =>
  ![null, undefined].includes(value) && !Number.isNaN(value);

export default function normalizeData(config) {
  const { data, xKey, yKey } = config;

  if (!data || !data.length || !data[0]?.series) {
    return [
      {
        name: 'Invalid data',
        series: [
          {
            x: null,
            y: 0,
          },
          {
            x: null,
            y: 100,
          },
        ],
      },
    ];
  }

  return data.map(dataset => {
    const { name, code, series } = dataset;
    if (!series?.length) {
      return {
        name,
        code,
        series,
      };
    }

    const hasTheRightKeys = series[0].x && series[0].y;
    if (hasTheRightKeys) {
      return {
        ...dataset,
        series: map(series, entry => ({
          x: entry.x,
          y: isValidOrdinate(entry.y) ? entry.y : 0,
          meta: entry.meta,
          color: entry.color,
        })),
      };
    }

    return {
      name,
      code,
      series: map(series, entry => ({
        x: entry[xKey],
        y: isValidOrdinate(entry[yKey]) ? entry[yKey] : 0,
        meta: entry.meta,
        color: entry.color,
      })),
    };
  });
}
