import React from 'react';
import Indicator from './Indicator';
import FieldInput from './FieldInput';
import FieldSelect from './FieldSelect';
import FieldColor from './FieldColor';
import FieldThickness from './FieldThickness';
import arrayReplace from '../../../../modules/shared/arrayReplace';

export default function MovingAverage({ context }) {
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
      <FieldColor
        value={indicator.color}
        options={indicator.colorOptions}
        setValue={value => setValue('color', value)}
      />
      <FieldThickness
        value={indicator.thickness}
        setValue={value => setValue('thickness', value)}
      />
    </Indicator>
  );
}
