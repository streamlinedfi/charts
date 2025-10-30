import { Div, divMixin } from '@streamlinedfi/div';
import { transparentize } from 'polished';
import React, { useEffect, useState } from 'react';
import styled, { css } from 'styled-components';
import useContext from '../../modules/useContext';

export const StyledField = styled.input`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${props => props.bgColor};
  background-color: ${props => props.bgColor};
  box-shadow: inset 0 0 0 1px transparent;
  padding: 12px 16px;
  outline: 0;
  line-height: 20px;
  font-weight: 500;
  transition: all 0.2s;
  color: ${props => props.color};

  ${props =>
    props.value
      ? css`
          border-color: ${props.bgColor};
          background-color: ${props.bgColor};
        `
      : css`
          &:not([readonly]):not(:focus):hover {
            border-color: ${props.bgColorHover};
            background-color: ${props.bgColorHover};
          }
        `}

  &.is-focused,
  &:not([readonly]):focus {
    border-color: ${props => props.primary};
    box-shadow: inset 0 0 0 1px ${props => transparentize(0.5, props.primary)};
    background-color: ${props => props.bgColor};
  }

  &[readonly] {
    color: rgba(51, 51, 51, 0.6);
    cursor: not-allowed;
  }

  ${props => props.css};
  ${props => divMixin(props)};
`;

const Input = React.forwardRef((props, ref) => {
  const { config } = useContext();

  const {
    id,
    name,
    placeholder,
    as = 'input',
    css: wrapperCss,
    wrapperProps,
    children,
    value,
    focus,
    autofocus,
    ...allRest
  } = props;

  const { rest, wrapperDivProps } = Object.entries(allRest).reduce(
    (next, [key, val]) => {
      /* eslint-disable no-param-reassign */
      if (key.startsWith('$')) {
        next.wrapperDivProps[key.slice(1)] = val === 0 ? '0' : val;
      } else {
        next.rest[key] = val;
      }
      return next;
    },
    {
      rest: {},
      wrapperDivProps: {},
    },
  );

  const [isTouched, setIsTouched] = useState(false);

  useEffect(() => {
    if (!isTouched && value) {
      setIsTouched(true);
    }
  }, [isTouched, value]);

  return (
    <Div
      $relative
      $mb={2}
      $maxW={342}
      css={wrapperCss}
      {...wrapperProps}
      {...wrapperDivProps}
    >
      <Div $w="100%">
        <StyledField
          as={as}
          id={id || name}
          name={name}
          ref={rf => {
            if (autofocus && rf) {
              rf.focus();
            }
            if (ref) {
              ref.current = rf;
            }
          }}
          value={value}
          placeholder={placeholder}
          className={focus ? 'is-focused' : ''}
          $primary={config.theme.primary}
          $color={config.theme.input.color}
          $bgColor={config.theme.input.bgColor}
          $bgColorHover={config.theme.input.bgColorHover}
          {...rest}
        >
          {children}
        </StyledField>
      </Div>
    </Div>
  );
});

export default Input;
