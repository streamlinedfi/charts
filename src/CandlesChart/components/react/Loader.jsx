import React from 'react'
import { css, keyframes } from 'styled-components'
import Div from './Div'
import Text from './Text'

const load = keyframes`
  0% {
    transform: translate3d(-100%, 0, 0);
  }

  100% {
    transform: translate3d(100%, 0, 0);
  }
`

export default function Loader({
  text,
  width = '100%',
  $w,
  $width,
  height = 100,
  $h,
  $height,
  progress,
  small = false,
  ...props
}) {
  return (
    <Div
      $flex
      $column
      $innerCenter
      $w={$w || $width || width}
      $h={$h || $height || height}
      {...props}
    >
      {text && (
        <Text $color={400} $mb={1}>
          {text}
        </Text>
      )}
      {progress !== undefined ? (
        <Div
          $relative
          $w={66}
          $h={2}
          $overflow="hidden"
          $radius={2}
          $background={(theme) => theme.fill300}
        >
          <Div
            $absolute
            $top={0}
            $left={0}
            $w={66}
            $h={2}
            $radius={2}
            $background={(theme) => theme.primary}
            $transform={`translateX(${-100 + progress * 100}%)`}
          />
        </Div>
      ) : (
        <Div $relative $w={small ? 18 : 22} $h={2} $overflow="hidden" $radius={2}>
          <Div
            $absolute
            $top={0}
            $left={0}
            $w={small ? 18 : 22}
            $h={2}
            $radius={2}
            $background={(theme) => theme.primary}
            css={css`
              animation: ${load} 1s ease infinite;
            `}
          />
        </Div>
      )}
    </Div>
  )
}
