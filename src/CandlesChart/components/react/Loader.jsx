import { Div } from '@streamlinedfi/div';
import React from 'react';
import styled, { keyframes } from 'styled-components';

const load = keyframes`
  0% {
    transform: translate3d(-100%, 0, 0);
  }

  100% {
    transform: translate3d(100%, 0, 0);
  }
`;

const AnimatedDiv = styled(Div)`
  animation: ${load} 1s ease infinite;
`;

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
  color = '#0094FF',
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
      <Div $relative $w={small ? 18 : 22} $h={2} $overflow="hidden" $radius={2}>
        <AnimatedDiv
          $absolute
          $top={0}
          $left={0}
          $w={small ? 18 : 22}
          $h={2}
          $radius={2}
          $background={color}
        />
      </Div>
    </Div>
  );
}
