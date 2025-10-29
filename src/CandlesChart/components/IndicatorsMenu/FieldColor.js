import React from 'react';
import uniq from 'lodash/uniq';
import Div from '../../../Div';
import Text from '../../../Text';

export default function FieldColor({
  label = 'Color',
  options,
  value,
  setValue,
}) {
  return (
    <Div $px={1.25} $py={1} $borderTop={theme => theme.fill200}>
      <Text $size={13} $color={600} $mb={0.5}>
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
