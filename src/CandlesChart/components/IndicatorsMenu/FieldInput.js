import { Div, Text } from '@streamlinedfi/div';
import React from 'react';
import useContext from '../../modules/useContext';
import Input from '../react/Input';

export default function FieldInput({ label, value, setValue }) {
  const { config } = useContext();
  return (
    <Div
      $px={1.25}
      $py={1}
      $borderTop={config.theme.indicatorsMenu.borderColor}
    >
      <Text
        $size={13}
        $color={config.theme.indicatorsMenu.labelColor}
        $mt={0}
        $mb={0.5}
      >
        {label}
      </Text>
      <Input
        type="number"
        name={label}
        onChange={event => setValue(event.target.value)}
        value={Math.abs(value)}
        min={0}
        wrapperProps={{
          $maxW: 'auto',
          $mb: 0,
        }}
      />
    </Div>
  );
}
