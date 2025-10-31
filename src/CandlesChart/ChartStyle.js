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
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      font-smoothing: antialiased;
    }

    p {
      font-weight: ${props => props.theme.fontWeight};
      font-size: ${props => props.theme.fontSize}px;
    }

    a,
    button,
    label {
      cursor: pointer;

      &:active:not([disabled]) {
        filter: brightness(90%);
        transition-duration: 0.05s;
      }
    }

    a {
      &,
      &:active,
      &:visited,
      &:hover {
        text-decoration: none;
      }
    }
  }
`;
