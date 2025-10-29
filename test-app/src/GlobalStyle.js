import { createGlobalStyle } from 'styled-components';

export default createGlobalStyle`
  html {
    box-sizing: border-box;
  }

  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }

  body {
    margin: 0;
    background: ${props => props.theme.background};
  }

  html,
  body,
  #root {
    height: 100%;
  }
`;
