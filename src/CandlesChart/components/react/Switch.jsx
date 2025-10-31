import Div from '@streamlinedfi/div';
import React from 'react';
import useContext from '../../modules/useContext';

export default function Switch({
  active,
  setActive,
  outerWidth = 44,
  outerHeight = 30,
  innerSize = 24,
  innerMargin = 3,
}) {
  const { config } = useContext();

  return (
    <Div
      as="button"
      $border="0"
      $relative
      $w={outerWidth}
      $radius={21}
      $h={outerHeight}
      $background={
        active
          ? config.theme.switch.activeBgColor
          : config.theme.switch.inactiveBgColor
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
        $background={
          active
            ? config.theme.switch.activeColor
            : config.theme.switch.inactiveColor
        }
      />
    </Div>
  );
}
