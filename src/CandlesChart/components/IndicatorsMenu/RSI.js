import React from 'react';
import arrayReplace from '../../../../modules/shared/arrayReplace';
import FieldColor from './FieldColor';
import FieldInput from './FieldInput';
import FieldThickness from './FieldThickness';
import Indicator from './Indicator';

export default function RSI({ context }) {
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
      <FieldColor
        value={indicator.color}
        options={indicator.colorOptions}
        setValue={value => setValue('color', value)}
      />
      <FieldThickness
        value={indicator.thickness}
        setValue={value => setValue('thickness', value)}
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
