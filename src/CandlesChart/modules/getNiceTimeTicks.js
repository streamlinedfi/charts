import moment from 'moment-timezone';
import ms from 'milliseconds';
import last from 'lodash/last';
import forEach from 'lodash/forEach';

function getYearlyDomain(series, scale, timezone) {
  const ticks = [];
  const years = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const year = momentTime.format('YYYY');

    if (!years[year]) {
      years[year] = year;
      ticks.push({
        i,
        value: momentTime.format('YYYY'),
        x: scale(i),
        // emphasize: true,
      });
    }
  });

  return ticks;
}

function getBiYearlyDomain(series, scale, timezone) {
  const ticks = [];
  const years = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const year = momentTime.format('YYYY');
    const quarter = momentTime.format('Q');
    const month = momentTime.format('MMM');

    if (quarter !== '1' && quarter !== '3') return;

    if (!years[year]) {
      years[year] = {};
      years[year][quarter] = quarter;
      ticks.push({
        i,
        value: quarter === '1' ? momentTime.format('YYYY') : month,
        x: scale(i),
        emphasize: true,
      });
    }

    if (years[year] && !years[year][quarter]) {
      years[year][quarter] = quarter;
      ticks.push({
        i,
        value: month,
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getQuarterlyDomain(series, scale, timezone) {
  const ticks = [];
  const years = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const year = momentTime.format('YYYY');
    const quarter = momentTime.format('Q');
    const month = momentTime.format('MMM');

    if (!years[year]) {
      years[year] = {};
      years[year][quarter] = quarter;
      ticks.push({
        i,
        value: quarter === '1' ? momentTime.format('YYYY') : month,
        x: scale(i),
        emphasize: true,
      });
    }

    if (years[year] && !years[year][quarter]) {
      years[year][quarter] = quarter;
      ticks.push({
        i,
        value: month,
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getMonthlyDomain(series, scale, timezone) {
  const ticks = [];
  const years = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const year = momentTime.format('YYYY');
    const month = momentTime.format('MMM');

    if (!years[year]) {
      years[year] = {};
      years[year][month] = month;
      ticks.push({
        i,
        value: month === 'Jan' ? momentTime.format('YYYY') : month,
        x: scale(i),
        emphasize: month === 'Jan',
      });
    }

    if (years[year] && !years[year][month]) {
      years[year][month] = month;
      ticks.push({
        i,
        value: month === 'Jan' ? momentTime.format('YYYY') : month,
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getIntraMonthlyDomain(series, scale, timezone) {
  const ticks = [];
  const months = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const month = momentTime.format('M');
    const middleOfMonthMoment = momentTime
      .clone()
      .startOf('month')
      .add(Math.floor(momentTime.daysInMonth() / 2), 'days');

    if (!months[month]) {
      months[month] = [];
      months[month][0] = momentTime;
      ticks.push({
        i,
        value:
          month === '1' ? momentTime.format('YYYY') : momentTime.format('MMM'),
        x: scale(i),
        emphasize: true,
      });
    }

    if (
      !months[month][1] &&
      momentTime.valueOf() >= middleOfMonthMoment.valueOf()
    ) {
      months[month][1] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getIntraThirdMonthlyDomain(series, scale, timezone) {
  const ticks = [];
  const months = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const month = momentTime.format('M');
    const firstThirdOfMonthMoment = momentTime
      .clone()
      .startOf('month')
      .add(Math.floor(momentTime.daysInMonth() / 3), 'days');
    const secondThirdOfMonthMoment = momentTime
      .clone()
      .startOf('month')
      .add(Math.floor((momentTime.daysInMonth() / 3) * 2), 'days');

    if (!months[month]) {
      months[month] = [];
      months[month][0] = momentTime;
      ticks.push({
        i,
        value:
          month === '1' ? momentTime.format('YYYY') : momentTime.format('MMM'),
        x: scale(i),
        emphasize: true,
      });
    }

    if (
      !months[month][1] &&
      momentTime.valueOf() >= firstThirdOfMonthMoment.valueOf()
    ) {
      months[month][1] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
      });
    }

    if (
      !months[month][2] &&
      momentTime.valueOf() >= secondThirdOfMonthMoment.valueOf()
    ) {
      months[month][2] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getIntraFourthMonthlyDomain(series, scale, timezone) {
  const ticks = [];
  const months = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const month = momentTime.format('M');
    const firstFourthOfMonthMoment = momentTime
      .clone()
      .startOf('month')
      .add(Math.floor(momentTime.daysInMonth() / 4), 'days');
    const secondFourthOfMonthMoment = momentTime
      .clone()
      .startOf('month')
      .add(Math.floor((momentTime.daysInMonth() / 4) * 2), 'days');
    const thirdFourthOfMonthMoment = momentTime
      .clone()
      .startOf('month')
      .add(Math.floor((momentTime.daysInMonth() / 4) * 3), 'days');

    if (!months[month]) {
      months[month] = [];
      months[month][0] = momentTime;
      ticks.push({
        i,
        value:
          month === '1' ? momentTime.format('YYYY') : momentTime.format('MMM'),
        x: scale(i),
        emphasize: true,
      });
    }

    if (
      !months[month][1] &&
      momentTime.valueOf() >= firstFourthOfMonthMoment.valueOf()
    ) {
      months[month][1] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
      });
    }

    if (
      !months[month][2] &&
      momentTime.valueOf() >= secondFourthOfMonthMoment.valueOf()
    ) {
      months[month][2] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
      });
    }

    if (
      !months[month][3] &&
      momentTime.valueOf() >= thirdFourthOfMonthMoment.valueOf()
    ) {
      months[month][3] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getEveryOtherDayDomain(series, scale, timezone) {
  const ticks = [];
  const months = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const month = momentTime.format('M');
    const day = momentTime.format('D');

    if (!months[month]) {
      months[month] = {};
      months[month][day] = momentTime;
      ticks.push({
        i,
        value:
          month === '1' ? momentTime.format('YYYY') : momentTime.format('MMM'),
        x: scale(i),
        emphasize: true,
      });
    }

    if (months[month] && !months[month][day]) {
      months[month][day] = momentTime;
      const isOddLength = Object.keys(months[month]).length % 2 === 1;
      if (isOddLength) {
        ticks.push({
          i,
          value: momentTime.format('D'),
          x: scale(i),
        });
      }
    }
  });

  return ticks;
}

function getEveryDayDomain(series, scale, timezone) {
  const ticks = [];
  const months = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const month = momentTime.format('M');
    const day = momentTime.format('D');

    if (!months[month]) {
      months[month] = {};
      months[month][day] = momentTime;
      ticks.push({
        i,
        value:
          month === '1' ? momentTime.format('YYYY') : momentTime.format('MMM'),
        x: scale(i),
        emphasize: true,
      });
    }

    if (months[month] && !months[month][day]) {
      months[month][day] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getIntraDayDomain(series, scale, timezone) {
  const ticks = [];
  const days = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const day = momentTime.format('D');
    const middleOfDayMoment = momentTime
      .clone()
      .startOf('day')
      .add(12, 'hours');

    if (!days[day]) {
      days[day] = [];
      days[day][0] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
        emphasize: true,
      });
    }

    if (!days[day][1] && momentTime.valueOf() >= middleOfDayMoment.valueOf()) {
      days[day][1] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('H:mm'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

const sessionMapping = {
  '0930-1600': momentTime => [
    momentTime
      .clone()
      .startOf('day')
      .add(12, 'hours'),
    momentTime
      .clone()
      .startOf('day')
      .add(13, 'hours')
      .add(30, 'minuts'),
    momentTime
      .clone()
      .startOf('day')
      .add(15, 'hours'),
  ],
  '0400-2000': momentTime => [
    momentTime
      .clone()
      .startOf('day')
      .add(8, 'hours'),
    momentTime
      .clone()
      .startOf('day')
      .add(12, 'hours'),
    momentTime
      .clone()
      .startOf('day')
      .add(16, 'hours'),
  ],
  '0000-2400': momentTime => [
    momentTime
      .clone()
      .startOf('day')
      .add(6, 'hours'),
    momentTime
      .clone()
      .startOf('day')
      .add(12, 'hours'),
    momentTime
      .clone()
      .startOf('day')
      .add(18, 'hours'),
  ],
};

function getIntraFourthDayDomain(series, scale, timezone, session) {
  const ticks = [];
  const days = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const day = momentTime.format('D');
    const intraDayMoments = sessionMapping[session](momentTime);

    if (!days[day]) {
      days[day] = [];
      days[day][0] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
        emphasize: true,
      });
    }

    if (!days[day][1] && momentTime.valueOf() >= intraDayMoments[0].valueOf()) {
      days[day][1] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('H:mm'),
        x: scale(i),
      });
    }

    if (!days[day][2] && momentTime.valueOf() >= intraDayMoments[1].valueOf()) {
      days[day][2] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('H:mm'),
        x: scale(i),
      });
    }

    if (!days[day][3] && momentTime.valueOf() >= intraDayMoments[2].valueOf()) {
      days[day][3] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('H:mm'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getEveryThirdHourlyDomain(series, scale, timezone) {
  const ticks = [];
  const days = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const day = momentTime.format('D');

    if (!days[day]) {
      days[day] = [];
      days[day][0] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
        emphasize: true,
      });
    }

    if (
      days[day] &&
      (momentTime.format('HH') === '12' || momentTime.format('HH') === '14') &&
      momentTime.format('HH') > last(days[day]).format('HH')
    ) {
      const nextI = Object.keys(days[day]).length;
      days[day][nextI] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('H:mm'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getEveryOtherHourlyDomain(series, scale, timezone) {
  const ticks = [];
  const days = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const day = momentTime.format('D');

    if (!days[day]) {
      days[day] = [];
      days[day][0] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
        emphasize: true,
      });
    } else if (
      days[day] &&
      momentTime.format('HH') % 2 === 0 &&
      momentTime.format('HH') > last(days[day]).format('HH')
    ) {
      const nextI = Object.keys(days[day]).length;
      days[day][nextI] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('H:mm'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getHourlyDomain(series, scale, timezone) {
  const ticks = [];
  const days = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const day = momentTime.format('D');

    if (!days[day]) {
      days[day] = [];
      days[day][0] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
        emphasize: true,
      });
    } else if (
      days[day] &&
      momentTime.format('HH') > last(days[day]).format('HH')
    ) {
      const nextI = Object.keys(days[day]).length;
      days[day][nextI] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('H:mm'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getIntraHourlyDomain(series, scale, timezone) {
  const ticks = [];
  const days = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const day = momentTime.format('D');
    const hour = momentTime.format('HH');
    const minute = momentTime.format('mm') < 30 ? 0 : 30;
    const hourMinute = hour + ':' + minute;

    if (!days[day]) {
      days[day] = {};
      days[day][hourMinute] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
        emphasize: true,
      });
    }

    if (days[day] && !days[day][hourMinute]) {
      days[day][hourMinute] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('H:mm'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

function getEvery15mDomain(series, scale, timezone) {
  const ticks = [];
  const days = {};

  forEach(series, ({ i, time }) => {
    const momentTime = moment(time).tz(timezone);
    const day = momentTime.format('D');
    const hour = momentTime.format('HH');
    const minute = Math.floor(momentTime.format('mm') / 15);
    const hourMinute = hour + ':' + minute;

    if (!days[day]) {
      days[day] = {};
      days[day][hourMinute] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('D'),
        x: scale(i),
        emphasize: true,
      });
    }

    if (days[day] && !days[day][hourMinute]) {
      days[day][hourMinute] = momentTime;
      ticks.push({
        i,
        value: momentTime.format('H:mm'),
        x: scale(i),
      });
    }
  });

  return ticks;
}

export default function getNiceTimeTicks(config, data, scale, timeScale) {
  if (!data.series) return [];

  const minTickWidth = 80;
  const eightyPxTime =
    timeScale.invert(timeScale.range()[0] + minTickWidth) -
    timeScale.invert(timeScale.range()[0]);

  const domainRange = scale.domain()[1] - scale.domain()[0];
  const domainGap = scale.domain()[1] - last(data.series).i;
  const visibleSeries = data.series.slice(-Math.ceil(domainRange - domainGap));

  // console.log('days ', tickTimespan / ms.days(1));
  // console.log('hours ', tickTimespan / ms.hours(1));

  if (eightyPxTime >= ms.days(180)) {
    return getYearlyDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.days(124)) {
    return getBiYearlyDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.days(53)) {
    return getQuarterlyDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.days(22)) {
    return getMonthlyDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.days(14)) {
    return getIntraMonthlyDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.days(10)) {
    return getIntraThirdMonthlyDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.days(7)) {
    return getIntraFourthMonthlyDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.days(3)) {
    return getEveryOtherDayDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.hours(20) || /D/.test(config.timeframe.id)) {
    return getEveryDayDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.hours(12)) {
    return getIntraDayDomain(visibleSeries, scale, config.timezone);
  }
  // if (eightyPxTime >= ms.hours(9)) {
  //   return getIntraFourthDayDomain(
  //     visibleSeries,
  //     scale,
  //     config.timezone,
  //     config.session,
  //   );
  // }
  if (eightyPxTime >= ms.hours(8)) {
    return getEveryThirdHourlyDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.hours(6)) {
    return getEveryOtherHourlyDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.hours(1) || /H/.test(config.timeframe.id)) {
    return getHourlyDomain(visibleSeries, scale, config.timezone);
  }
  if (eightyPxTime >= ms.minutes(30)) {
    return getIntraHourlyDomain(visibleSeries, scale, config.timezone);
  }
  return getEvery15mDomain(visibleSeries, scale, config.timezone);
}
