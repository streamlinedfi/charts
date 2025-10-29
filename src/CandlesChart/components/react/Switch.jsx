import Div from '@streamlinedfi/div';
import { transparentize } from 'polished';
import React from 'react';

export default function Switch({
  active,
  setActive,
  outerWidth = 44,
  outerHeight = 30,
  innerSize = 24,
  innerMargin = 3,
}) {
  return (
    <Div
      as="button"
      $relative
      $w={outerWidth}
      $radius={21}
      $h={outerHeight}
      $background={theme =>
        active ? transparentize(0.25, theme.primary) : theme.fill300
      }
      onClick={() => setActive(!active)}
    >
      <Div
        $absolute
        $top={innerMargin}
        $left={innerMargin}
        $transform={`translateX(${active ? '14px' : 0})`}
        $transition
        $w={innerSize}
        $h={innerSize}
        $radius="50%"
        $background={theme => (active ? theme.fill800 : theme.fill600)}
      />
    </Div>
  );
}
