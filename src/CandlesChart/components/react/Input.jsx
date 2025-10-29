import { ErrorMessage, Field } from 'formik'
import { tint, transparentize } from 'polished'
import React, { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import theme from '../modules/shared/theme'
import Div, { divMixin, pixelate } from './Div'

const inputBackground = tint(0.02, theme.background)
const inputBackgroundHover = tint(0.03, theme.background)
const inputBackgroundDarker = tint(0.02, theme.backgroundDarker)
const inputBackgroundDarkerHover = tint(0.03, theme.backgroundDarker)

export const Label = styled.label`
  position: absolute;
  z-index: 1;
  top: ${(props) => props.theme.spacing(0.75)};
  left: ${(props) => props.theme.spacing(0.5)};
  padding: 0 ${(props) => props.theme.spacing(0.5)};
  color: ${(props) => props.theme.fill500};
  margin-bottom: ${(props) => props.theme.spacing(0.25)};
  transition: all 0.2s;
  transform-origin: bottom left;
  pointer-events: none;
  font-weight: 500;
`

const LabelBg = styled.div`
  position: absolute;
  z-index: 1;
  top: 9px;
  height: 3px;
  left: 4px;
  right: 4px;
  background: ${(props) => inputBackground};
`

export const HeaderLabel = styled.label`
  width: 100%;
  display: block;
  margin-bottom: 6px;
  font-weight: 500;
  color: ${(props) => props.theme.fill500};
  white-space: nowrap;

  ${(props) =>
    props.columns &&
    css`
      flex-shrink: 0;
      line-height: 46px;
      margin-bottom: 0;

      ${Array.isArray(props.columns) ? `width: ${pixelate(props.columns[0])};` : `width: 188px;`}
    `}
`

export const StyledField = styled(({ useFormik, ...props }) =>
  useFormik ? <Field {...props} /> : <input {...props} />
)`
  width: 100%;
  border-radius: 8px;
  border: 1px solid ${(props) => (props.darker ? inputBackgroundDarker : inputBackground)};
  background-color: ${(props) => (props.darker ? inputBackgroundDarker : inputBackground)};
  box-shadow: inset 0 0 0 1px transparent;
  padding: ${(props) => props.theme.spacing(0.75)} ${(props) => props.theme.spacing(1)};
  outline: 0;
  line-height: 20px;
  font-weight: 500;
  transition: all 0.2s;
  color: ${(props) => props.theme.fill700};

  ${(props) =>
    props.value
      ? css`
          border-color: ${props.darker ? inputBackgroundDarker : inputBackground};
          background-color: ${props.darker ? inputBackgroundDarker : inputBackground};

          ~ ${Label} {
            transform: translate(1px, -23px) scale(0.92857);
            opacity: 1;
          }
        `
      : css`
          &:not([readonly]):not(:focus):hover {
            border-color: ${props.darker ? inputBackgroundDarkerHover : inputBackgroundHover};
            background-color: ${props.darker ? inputBackgroundDarkerHover : inputBackgroundHover};

            ~ ${Label} {
              background-color: ${props.darker ? inputBackgroundDarkerHover : inputBackgroundHover};
            }
          }
        `}

  &.is-focused,
  &:not([readonly]):focus {
    border-color: ${(props) => props.theme.primary};
    box-shadow: inset 0 0 0 1px ${(props) => transparentize(0.5, props.theme.primary)};
    background-color: ${(props) => (props.darker ? inputBackgroundDarker : inputBackground)};

    ~ ${Label} {
      transform: translate(1px, -23px) scale(0.92857);
      color: ${(props) => props.theme.primary};
      opacity: 1;
    }
  }

  &[readonly] {
    color: rgba(51, 51, 51, 0.6);
    cursor: not-allowed;
  }

  ${(props) => props.css};
  ${(props) => divMixin(props)};
`

export const StyledErrorMessage = styled.div`
  margin-top: 2px;
  font-size: 13px;
  font-weight: 500;
  color: ${(props) => props.theme.error};
  text-align: left;
  padding: 0 ${(props) => props.theme.spacing(0.5)};
  ${(props) => props.css};
`

const Input = React.forwardRef((props, ref) => {
  const {
    id,
    name,
    label,
    fixedLabel = false,
    placeholder,
    as = 'input',
    css: wrapperCss,
    wrapperProps,
    renderHeader,
    renderFooter,
    children,
    inputCss,
    messageCss,
    value,
    useFormik = true,
    withError = true,
    errorMsg,
    focus,
    autofocus,
    columns,
    ...allRest
  } = props

  const { rest, wrapperDivProps } = Object.entries(allRest).reduce(
    (next, [key, val]) => {
      /* eslint-disable no-param-reassign */
      if (key.startsWith('$')) {
        next.wrapperDivProps[key.slice(1)] = val === 0 ? '0' : val
      } else {
        next.rest[key] = val
      }
      return next
    },
    {
      rest: {},
      wrapperDivProps: {}
    }
  )

  const [isTouched, setIsTouched] = useState(false)

  useEffect(() => {
    if (!isTouched && value) {
      setIsTouched(true)
    }
  }, [isTouched, value])

  return (
    <Div
      $relative
      $mb={2}
      $maxW={342}
      css={wrapperCss}
      $flex={!!columns ? true : undefined}
      $wrap
      {...wrapperProps}
      {...wrapperDivProps}
    >
      {renderHeader}
      {label && (placeholder || fixedLabel) && (
        <HeaderLabel htmlFor={id || name} columns={columns}>
          {label}
        </HeaderLabel>
      )}
      <Div
        $w={
          columns ? (Array.isArray(columns) ? pixelate(columns[1]) : `calc(100% - 188px)`) : '100%'
        }
      >
        <StyledField
          as={as}
          id={id || name}
          name={name}
          ref={(rf) => {
            if (autofocus && rf) {
              rf.focus()
            }
            if (ref) {
              ref.current = rf
            }
          }}
          css={inputCss}
          value={value}
          placeholder={placeholder}
          useFormik={useFormik}
          className={focus ? 'is-focused' : ''}
          columns={columns}
          {...rest}
        >
          {children}
        </StyledField>
        {label && !placeholder && !fixedLabel && (
          <Label htmlFor={id || name} aria-hidden>
            <Div as="span" $relative $zIndex={2}>
              {label}
            </Div>
            <LabelBg />
          </Label>
        )}
        {((withError && useFormik) || errorMsg) && (
          <>
            {errorMsg ? (
              <StyledErrorMessage css={messageCss} data-test-id={`${id || name}-error`}>
                {errorMsg}
              </StyledErrorMessage>
            ) : (
              <ErrorMessage name={name}>
                {(msg) => (
                  <StyledErrorMessage css={messageCss} data-test-id={`${id || name}-error`}>
                    {msg}
                  </StyledErrorMessage>
                )}
              </ErrorMessage>
            )}
          </>
        )}
        {renderFooter}
      </Div>
    </Div>
  )
})

export default Input
