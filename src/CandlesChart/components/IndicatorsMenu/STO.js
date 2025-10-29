import React from 'react';
import Indicator from './Indicator';
import FieldInput from './FieldInput';
import FieldColor from './FieldColor';
import FieldThickness from './FieldThickness';
import arrayReplace from '../../../../modules/shared/arrayReplace';

export default function STO({ context }) {
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
        label="K Length"
        value={indicator.kLength}
        setValue={value => setValue('kLength', value)}
      />
      <FieldInput
        label="K Smoothing"
        value={indicator.kSmoothing}
        setValue={value => setValue('kSmoothing', value)}
      />
      <FieldInput
        label="D Smoothing"
        value={indicator.dSmoothing}
        setValue={value => setValue('dSmoothing', value)}
      />
      <FieldInput
        label="Upper line"
        value={indicator.upperLine}
        setValue={value => setValue('upperLine', value)}
      />
      <FieldInput
        label="Lower line"
        value={indicator.lowerLine}
        setValue={value => setValue('lowerLine', value)}
      />
    </Indicator>
  );
}
