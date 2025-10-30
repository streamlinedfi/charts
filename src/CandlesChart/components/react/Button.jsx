import Div from '@streamlinedfi/div';
import { transparentize } from 'polished';
import React, { forwardRef } from 'react';
import useContext from '../../modules/useContext';
import Loader from './Loader';

const sizesProps = {
  xl: {
    height: 52,
    fontSize: 16,
    fontWeight: 600,
    px: 1.5,
  },
  large: {
    height: 46,
    fontSize: 14,
    px: 1.25,
  },
  medium: {
    height: 42,
    fontSize: 14,
    px: 1,
  },
  small: {
    height: 34,
    fontSize: 13,
    px: 0.75,
  },
  xs: {
    height: 24,
    fontSize: 13,
    px: 0.5,
  },
};

function Button(
  {
    primary,
    primaryWhite,
    secondary,
    invisible,
    danger,
    buy,
    sell,
    children,
    disabled,
    rounded,
    loading,
    onClick,
    active,
    size = 'large',
    ...props
  },
  ref,
) {
  const { config } = useContext();

  const styleProps = {
    $border: active
      ? config.theme.theme.borderColorActive
      : config.theme.theme.borderColor,
    $border$hover: active
      ? config.theme.theme.borderColorActive
      : config.theme.theme.borderColorHover,
    $boxShadow: `inset 0 0 0 1px ${
      active
        ? transparentize(0.5, config.theme.theme.borderColorActive)
        : 'transparent'
    }`,
    $color: active ? config.theme.theme.colorActive : config.theme.theme.color,
    $color$hover: active
      ? config.theme.theme.colorActive
      : config.theme.theme.colorHover,
  };

  const { height, fontSize, fontWeight, px } = sizesProps[size];

  return (
    <Div
      as="button"
      ref={ref}
      $inlineFlex
      $innerCenter
      $h={height}
      $radius={rounded ? height / 2 : 8}
      $px={px}
      $fontSize={fontSize}
      $fontWeight={fontWeight}
      $cursor={disabled ? 'default' : 'pointer'}
      onClick={disabled ? undefined : onClick}
      {...styleProps}
      {...props}
    >
      {loading ? <Loader /> : children}
    </Div>
  );
}

export default forwardRef(Button);
