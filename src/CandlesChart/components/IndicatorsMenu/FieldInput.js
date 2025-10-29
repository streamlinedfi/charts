import { Div, Text } from '@streamlinedfi/div';
import React from 'react';
import Input from '../react/Input';

export default function FieldInput({ label, value, setValue }) {
  return (
    <Div $px={1.25} $py={1} $borderTop={theme => `1px solid ${theme.fill300}`}>
      <Text $size={13} $color={600} $mb={0.5}>
        {label}
      </Text>
      <Input
        type="number"
        name={label}
        useFormik={false}
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
