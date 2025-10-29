import React from 'react';
import Div from '../../../Div';
import Text from '../../../Text';
import Button from '../../../Button';
import { transparentize, tint } from 'polished';

export default function FieldInput({ label = 'Thickness', value, setValue }) {
  return (
    <Div $px={1.25} $py={1} $borderTop={theme => theme.fill200}>
      <Text $size={13} $color={600} $mb={0.5}>
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
            $background={theme => tint(0.02, theme.background)}
            $border={theme =>
              thickness === value ? theme.blue800 : tint(0.02, theme.background)
            }
          >
            <Div
              $w={18}
              $h={thickness}
              $background={theme =>
                thickness === value ? theme.blue900 : theme.fill700
              }
            />
          </Button>
        ))}
      </Div>
    </Div>
  );
}
