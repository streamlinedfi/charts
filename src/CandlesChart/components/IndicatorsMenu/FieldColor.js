import { Div, Text } from '@streamlinedfi/div';
import uniq from 'lodash/uniq';
import React from 'react';
import useContext from '../../modules/useContext';

export default function FieldColor({
  label = 'Color',
  options,
  value,
  setValue,
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
        {uniq(options).map(color => (
          <Div
            as="button"
            key={color}
            $shrink={0}
            $w={24}
            $h={24}
            $radius="50%"
            $border={`1.5px solid ${color}`}
            $background={value === color ? color : undefined}
            $mr={0.5}
            onClick={() => setValue(color)}
          />
        ))}
      </Div>
    </Div>
  );
}
