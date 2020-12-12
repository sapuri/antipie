import React, { FC } from 'react';
import '@tensorflow/tfjs-backend-cpu';
import { ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { theme } from './styles/theme';
import { Content } from './components/Content';
import './App.css';

const App: FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Content />
    </ThemeProvider>
  );
};

export default App;
