import React from 'react';
import { createGlobalStyle } from 'styled-components';
import RangeSlider from 'react-range-slider-input';
import { transparentize } from 'polished';
import Div from '../../Div';

const Style = createGlobalStyle`
  .range-slider {
    position: relative;
    height: 12px;
    width: 100%;
    border-radius: 6px;
    background: ${props => props.theme.background};
    border: 1px solid ${props => props.theme.fill300};
  }

  .range-slider input {
    display: none;
  }

  .range-slider__thumb {
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: -10px;
    z-index: 2;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: ${props => props.theme.background};
    border: 1px solid ${props => props.theme.fill300};
    box-shadow: 0 0 2px 1px rgba(0, 0, 0, .3);
    cursor: ew-resize;
    transition: filter .2s;
    transform: translateX(-16px);

    &:active {
      filter: brightness(90%);
      transition-duration: 0.05s;
    }

    &:before {
      content: "";
      display: block;
      height: 12px;
      width: 1.5px;
      margin-right: 2px;
      background: ${props => props.theme.fill500};
    }

    &:after {
      content: "";
      display: block;
      height: 12px;
      width: 1.5px;
      background: ${props => props.theme.fill500};
    }
  }

  .range-slider__range {
    position: absolute;
    z-index: 1;
    top: 0;
    height: 12px;
    background: ${props => transparentize(0.9, props.theme.primary)};
    border: 1px solid ${props => transparentize(0.5, props.theme.primary)};
    pointer-events: none;
  }
`;

export default function ControlSlider({ max, value, onInput }) {
  return (
    <Div $px={0.5}>
      <Style />
      <RangeSlider value={value} max={max} onInput={onInput} />
    </Div>
  );
}
