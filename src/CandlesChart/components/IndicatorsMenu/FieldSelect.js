import { Div, Text } from '@streamlinedfi/div';
import React from 'react';
import useContext from '../../modules/useContext';
import Button from '../react/Button';

export default function FieldSelect({
  label = 'Select',
  value,
  setValue,
  options,
}) {
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
        $mb={0.5}
      >
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
            $background={config.theme.indicatorsMenu.buttonBgColor}
            $border={
              option.value === value
                ? config.theme.primary
                : config.theme.indicatorsMenu.buttonBgColor
            }
          >
            {option.text}
          </Button>
        ))}
      </Div>
    </Div>
  );
}
