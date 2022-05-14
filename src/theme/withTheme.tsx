import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider } from '@mui/styles';
import * as React from 'react';

import theme from './config';

export default function withTheme(Component: any) {
  function WithTheme(props: object) {
    return (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Component {...props} />
      </ThemeProvider>
    );
  }

  return WithTheme;
}
