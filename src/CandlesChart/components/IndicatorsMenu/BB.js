import React from 'react';
import arrayReplace from '../../modules/arrayReplace';
import FieldInput from './FieldInput';
import Indicator from './Indicator';

export default function BB({ context }) {
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
    <Indicator context={context} indicator={indicator}>
      <FieldInput
        label="Length"
        value={indicator.length}
        setValue={value => setValue('length', value)}
      />
      <FieldInput
        label="Standard Deviation"
        value={indicator.stdDev}
        setValue={value => setValue('stdDev', value)}
      />
    </Indicator>
  );
}
