import { darken } from 'polished';
import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  .streamlined-chart-html {
    box-sizing: border-box;

    *,
    *:before,
    *:after {
      box-sizing: inherit;
    }

    &,
    input,
    textarea,
    button {
      font-family: ${props => props.theme.fontFamily};
      font-size: ${props => props.theme.fontSize}px;
      line-height: 1.5;
      font-weight: ${props => props.theme.fontStyle};
      font-style: normal;
      color: ${props => props.theme.color};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-smoothing: antialiased;
    }


    a,
    button,
    label {
      cursor: pointer;
      transition: all .2s;

      &:active:not([disabled]) {
        filter: brightness(90%);
        transition-duration: 0.05s;
      }
    }

    a {
      background-color: transparent;
      color: ${props => props.theme.primary};
      font-weight: 500;

      &:hover,
      &:focus,
      &:active {
        outline: 0;
        color: ${props => darken(0.1, props.theme.primary)};
      }

      &,
      &:active,
      &:visited,
      &:hover {
        text-decoration: none;
      }
    }

    button {
      border: 0;
      outline: 0;
      padding: 0;
      background: none;
    }

    button,
    input,
    select,
    optgroup,
    textarea {
      margin: 0;
      font: inherit;
      line-height: inherit;
      color: inherit;
    }

    button {
      overflow: visible;
    }

    button,
    select {
      text-transform: none;
    }

    input,
    textarea {
      outline: 0;
    }

    button,
    html input[type=button],
    input[type=reset],
    input[type=submit] {
      cursor: pointer;
      -webkit-appearance: button;
    }

    input {
      line-height: normal;
    }
  }
`;
