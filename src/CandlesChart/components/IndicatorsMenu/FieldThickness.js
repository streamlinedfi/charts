import { Div, Text } from '@streamlinedfi/div';
import React from 'react';
import useContext from '../../modules/useContext';
import Button from '../react/Button';

export default function FieldInput({ label = 'Thickness', value, setValue }) {
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
        {[1, 1.5, 2, 2.5, 3].map(thickness => (
          <Button
            key={thickness}
            size="xs"
            $mr={0.5}
            active={thickness === value}
            onClick={() => setValue(thickness)}
            $background={config.theme.indicatorsMenu.buttonBgColor}
            $border={
              thickness === value
                ? config.theme.primary
                : config.theme.indicatorsMenu.buttonBgColor
            }
          >
            <Div
              $w={18}
              $h={thickness}
              $background={
                thickness === value
                  ? config.theme.indicatorsMenu.buttonBorderColorActive
                  : config.theme.indicatorsMenu.buttonBorderColor
              }
            />
          </Button>
        ))}
      </Div>
    </Div>
  );
}
