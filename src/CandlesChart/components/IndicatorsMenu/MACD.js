import React from 'react';
import arrayReplace from '../../modules/arrayReplace';
import FieldInput from './FieldInput';
import FieldSelect from './FieldSelect';
import Indicator from './Indicator';

export default function MACD({ context }) {
  const { config, setConfig } = context;
  const [key, i] = config.indicators.currentScreenMeta;
  const indicator = config.indicators[key][i];

  const setValue = (k, v) =>
    setConfig({
      ...config,
      indicators: {
        ...config.indicators,
        [key]: arrayReplace(config.indicators[key], i, ic => ({
          ...ic,
          [k]: v,
        })),
      },
    });

  return (
    <Indicator
      context={context}
      indicator={indicator}
      // preSettingsChildren={
      //   <Backtests
      //     context={context}
      //     onSelect={values => {
      //       setConfig({
      //         ...config,
      //         indicators: {
      //           ...config.indicators,
      //           [key]: arrayReplace(config.indicators[key], i, ic => ({
      //             ...ic,
      //             fastLength: values.fastLength,
      //             slowLength: values.slowLength,
      //             signalLineLength: values.signalLineLength,
      //             signalThreshold: values.signalThreshold,
      //           })),
      //         },
      //       });
      //     }}
      //   />
      // }
    >
      <FieldSelect
        label="Type"
        value={indicator.type}
        options={[
          {
            text: 'Simple',
            value: 'SMA',
          },
          {
            text: 'Exponential',
            value: 'EMA',
          },
        ]}
        setValue={value => setValue('type', value)}
      />
      <FieldInput
        label="Fast Length"
        value={indicator.fastLength}
        setValue={value => setValue('fastLength', value)}
      />
      <FieldInput
        label="Slow Length"
        value={indicator.slowLength}
        setValue={value => setValue('slowLength', value)}
      />
      <FieldInput
        label="Signal Line Length"
        value={indicator.signalLineLength}
        setValue={value => setValue('signalLineLength', value)}
      />
      {/* <FieldInput
        label="Signal Threshold"
        value={indicator.signalThreshold}
        setValue={value => setValue('signalThreshold', value)}
      /> */}
    </Indicator>
  );
}
