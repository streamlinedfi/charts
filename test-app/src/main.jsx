import { createRoot } from 'react-dom/client';
import { ThemeProvider } from 'styled-components';
import App from './App.jsx';
import GlobalStyle from './GlobalStyle.js';
import { uiSystem } from './uiSystem.js';

createRoot(document.getElementById('root')).render(
  <ThemeProvider theme={uiSystem.theme}>
    <GlobalStyle />
    <App />
  </ThemeProvider>,
);
