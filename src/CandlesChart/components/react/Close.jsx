import Div from '@streamlinedfi/div';
import { Plus as FeatherPlus } from '@styled-icons/feather/Plus';
import React from 'react';
import useContext from '../../modules/useContext';

export default function Close({ onClick, size = 38, ...props }) {
  const { config } = useContext();

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
      $p={0}
      $border="0"
      $background="none"
      $background$active={config.theme.close.bgColorActive}
      $color={props.$color || config.theme.close.color}
      $color$hover={config.theme.close.colorHover}
      $color$active={config.theme.close.colorActive}
      onClick={onClick}
      {...props}
    >
      <Div as={FeatherPlus} $w={size * 0.75} $transform="rotate(45deg)" />
    </Div>
  );
}
