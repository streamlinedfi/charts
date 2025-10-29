import { Div, Text } from '@streamlinedfi/div';
import { tint } from 'polished';
import React from 'react';
import Button from '../react/Button';

export default function FieldSelect({
  label = 'Select',
  value,
  setValue,
  options,
}) {
  return (
    <Div $px={1.25} $py={1} $borderTop={theme => theme.fill200}>
      <Text $size={13} $color={600} $mb={0.5}>
        {label}
      </Text>
      <Div $flex>
        {options.map(option => (
          <Button
            key={option.value}
            size="xs"
            $mr={0.5}
            active={option.value === value}
            onClick={() => setValue(option.value)}
            $background={theme => tint(0.02, theme.background)}
            $border={theme =>
              option.value === value
                ? theme.blue800
                : tint(0.02, theme.background)
            }
          >
            {option.text}
          </Button>
        ))}
      </Div>
    </Div>
  );
}
