import { mix, tint, transparentize } from 'polished'
import React, { forwardRef } from 'react'
import Div from './Div'
import Loader from './Loader'

const sizesProps = {
  xl: {
    height: 52,
    fontSize: 16,
    fontWeight: 600,
    px: 1.5
  },
  large: {
    height: 46,
    fontSize: 14,
    px: 1.25
  },
  medium: {
    height: 42,
    fontSize: 14,
    px: 1
  },
  small: {
    height: 34,
    fontSize: 13,
    px: 0.75
  },
  xs: {
    height: 24,
    fontSize: 13,
    px: 0.5
  }
}

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
  ref
) {
  let styleProps = {}

  if (primary) {
    styleProps = {
      $color: transparentize(0.1, 'white'),
      $color$hover: 'white',
      // $background: theme => transparentize(0.5, theme.primary),
      // $background$hover: theme => transparentize(0.4, theme.primary),
      $background: (theme) => mix(0.5, theme.background, theme.primary),
      $background$hover: (theme) => mix(0.4, theme.background, theme.primary),
      $boxShadow$focus: (theme) =>
        `0 0 0 2px ${theme.background},0 0 0 4px ${transparentize(0.6, theme.primary)}`
    }
  }

  if (primaryWhite) {
    styleProps = {
      $color: (theme) => theme.backgroundDarkest,
      $color$hover: (theme) => theme.primary,
      // $background: theme => transparentize(0.5, theme.primary),
      // $background$hover: theme => transparentize(0.4, theme.primary),
      $background: (theme) => theme.fill800,
      $background$hover: (theme) => theme.fill900,
      $boxShadow$focus: (theme) => `0 0 0 2px ${theme.background},0 0 0 4px ${theme.fill700}`
    }
  }

  if (secondary) {
    styleProps = {
      $background$hover: (theme) => tint(0.04, theme.background),
      $border$hover: (theme) => `1px solid ${theme.fill300}`,
      $color: (theme) => theme.fill700,
      $color$hover: (theme) => theme.fill900,
      $border: '1px solid transparent',
      $boxShadow$focus: (theme) => `0 0 0 2px ${theme.background},0 0 0 4px ${theme.fill300}`
    }

    if (!invisible) {
      styleProps = {
        ...styleProps,
        $background: (theme) => theme.background,
        $border: (theme) => `1px solid ${theme.fill300}`
      }
    }
  }

  if (danger) {
    styleProps = {
      $color: transparentize(0.1, 'white'),
      $color$hover: 'white',
      $background: (theme) => transparentize(0.6, theme.error),
      $background$hover: (theme) => transparentize(0.5, theme.error),
      $boxShadow$focus: (theme) =>
        `0 0 0 2px ${theme.background},0 0 0 4px ${transparentize(0.6, theme.error)}`
    }
  }

  if (buy) {
    styleProps = {
      $color: transparentize(0.1, 'white'),
      $color$hover: 'white',
      $background: (theme) => mix(0.25, theme.background, theme.green),
      $background$hover: (theme) => mix(0.1, theme.background, theme.green),
      $boxShadow$focus: (theme) =>
        `0 0 0 2px ${theme.background},0 0 0 4px ${transparentize(0.6, theme.green)}`
    }
  }

  if (sell) {
    styleProps = {
      $color: transparentize(0.1, 'white'),
      $color$hover: 'white',
      $background: (theme) => mix(0.25, theme.background, theme.red),
      $background$hover: (theme) => mix(0.1, theme.background, theme.red),
      $boxShadow$focus: (theme) =>
        `0 0 0 2px ${theme.background},0 0 0 4px ${transparentize(0.6, theme.red)}`
    }
  }

  if (disabled || loading) {
    styleProps = {
      ...styleProps,
      $background$hover: undefined,
      $background$important: (theme) => theme.fill200,
      $color$important: (theme) => theme.fill500,
      $boxShadow$focus: (theme) =>
        `0 0 0 2px ${theme.background},0 0 0 4px ${(theme) => theme.fill100}`
    }
  }

  if (!primary && !primaryWhite && !secondary && !danger && !buy && !sell) {
    styleProps = {
      $border: props.$border ? undefined : (theme) => (active ? theme.blue800 : theme.fill200),
      $border$hover: props.$border$hover
        ? undefined
        : (theme) => (active ? theme.blue800 : theme.fill300),
      $boxShadow: (theme) =>
        `inset 0 0 0 1px ${active ? transparentize(0.5, theme.blue800) : 'transparent'}`,
      $color: active ? (theme) => theme.blue800 : (theme) => theme.fill700,
      $color$hover: active ? (theme) => theme.blue800 : (theme) => theme.fill800
    }
  }

  const { height, fontSize, fontWeight, px } = sizesProps[size]

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
  )
}

export default forwardRef(Button)
