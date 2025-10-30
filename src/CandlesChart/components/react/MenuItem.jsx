import Div from '@streamlinedfi/div';
import React, { forwardRef } from 'react';
import useContext from '../../modules/useContext';

const MenuItem = forwardRef(
  ({ children, disabled, onClick, ...props }, ref) => {
    const { config } = useContext();

    return (
      <Div
        ref={ref}
        $block
        $py={0.375}
        $px={1.25}
        $mx={0.5}
        $radius={config.theme.menu.item.borderRadius}
        $background$hover={
          disabled ? undefined : config.theme.menu.item.bgColorHover
        }
        $background$active={
          disabled ? undefined : config.theme.menu.item.activeBgColor
        }
        $color={config.theme.menu.item.color}
        $color$hover={disabled ? undefined : config.theme.menu.item.colorHover}
        $color$active={
          disabled ? undefined : config.theme.menu.item.colorActive
        }
        $transition
        $cursor={disabled ? 'default' : 'pointer'}
        $opacity={disabled ? 0.5 : undefined}
        onClick={disabled ? undefined : onClick}
        {...props}
      >
        {children}
      </Div>
    );
  },
);

export default MenuItem;
