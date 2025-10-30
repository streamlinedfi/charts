import { Div } from '@streamlinedfi/div';
import React from 'react';
import { css, keyframes } from 'styled-components';
import useContext from '../../modules/useContext';

const load = keyframes`
  0% {
    transform: translate3d(-100%, 0, 0);
  }

  100% {
    transform: translate3d(100%, 0, 0);
  }
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
  ...props
}) {
  const { config } = useContext();

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
        <Div
          $absolute
          $top={0}
          $left={0}
          $w={small ? 18 : 22}
          $h={2}
          $radius={2}
          $background={config.theme.primary}
          css={css`
            animation: ${load} 1s ease infinite;
          `}
        />
      </Div>
    </Div>
  );
}
