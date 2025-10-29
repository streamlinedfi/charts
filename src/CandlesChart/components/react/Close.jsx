import { Plus as FeatherPlus } from '@styled-icons/feather/Plus'
import React from 'react'
import Div from './Div'

export default function Close({ onClick, size = 38, ...props }) {
  return (
    <Div
      as="button"
      $absolute
      $z={2}
      $flex
      $innerCenter
      $radius="50%"
      $top={8}
      $right={8}
      $w={size}
      $h={size}
      $background="none"
      $background$active={(theme) => theme.backgroundDarkest}
      $color={(theme) => theme.fill400}
      $color$hover={(theme) => theme.fill900}
      $color$active={(theme) => theme.fill700}
      onClick={onClick}
      {...props}
    >
      <Div as={FeatherPlus} $w={size * 0.75} $transform="rotate(45deg)" />
    </Div>
  )
}
