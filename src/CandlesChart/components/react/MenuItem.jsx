import { tint } from 'polished'
import React, { forwardRef } from 'react'
import Div from './Div'

const MenuItem = forwardRef(({ children, disabled, onClick, ...props }, ref) => (
  <Div
    ref={ref}
    $block
    $py={0.375}
    $px={1.25}
    $mx={0.5}
    $radius={8}
    $background$hover={disabled ? undefined : (theme) => tint(0.03, theme.background)}
    $background$active={disabled ? undefined : (theme) => theme.backgroundDarkest}
    $color={(theme) => theme.fill700}
    $color$hover={disabled ? undefined : (theme) => theme.fill900}
    $color$active={disabled ? undefined : (theme) => theme.fill800}
    $transition
    $cursor={disabled ? 'default' : 'pointer'}
    $opacity={disabled ? 0.5 : undefined}
    onClick={disabled ? undefined : onClick}
    {...props}
  >
    {children}
  </Div>
))

export default MenuItem
