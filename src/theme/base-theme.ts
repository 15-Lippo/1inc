import { ThemeOptions } from '@mui/material';

import { ExtendedTypographyOptions } from './theme';

const baseTheme: ThemeOptions = {
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          '&.MuiAccordionSummary-root.Mui-expanded': {
            minHeight: 0,
          },
        },
      },
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple, on the whole application 💣!
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          margin: 0,
          '&.MuiFormControlLabel-root .MuiFormControlLabel-label': {
            width: '100%',
          },
        },
      },
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          '&:before': {
            backgroundColor: 'white',
          },
          backgroundColor: 'transparent',
          boxShadow: 'none',
        },
      },
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: {
          padding: 0,
          minHeight: 0,
          '.MuiAccordionSummary-content': {
            height: '3rem',
            alignItems: 'center',
            margin: 0,
          },
          '.MuiAccordionSummary-content.Mui-expanded': {
            margin: 0,
          },
        },
      },
    },
    MuiAccordionDetails: {
      styleOverrides: {
        root: {
          padding: 0,
        },
      },
    },
    MuiMenuList: {
      styleOverrides: {
        root: {
          padding: 0,
          width: '100%',
        },
      },
    },
    MuiListItemIcon: {
      styleOverrides: {
        root: {
          display: 'flex',
          alignItems: 'center',
          width: '100%',
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          padding: '10px 0',
          '&$selected': {
            backgroundColor: 'transparent',
          },
          '&:hover': {
            backgroundColor: 'transparent',
          },
        },
      },
    },
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    rxxlg24: {
      fontWeight: 400,
      fontSize: '24px',
    },
    rlg18: {
      fontWeight: 400,
      fontSize: '18px',
    },
    rm16: {
      fontWeight: 400,
      fontSize: '16px',
    },
    rsm14: {
      fontWeight: 400,
      fontSize: '14px',
    },
    rxs12: {
      fontWeight: 400,
      fontSize: '12px',
    },
    mxlg20: {
      fontWeight: 500,
      fontSize: '20px',
    },
    mlg18: {
      fontWeight: 500,
      fontSize: '18px',
    },
    mm16: {
      fontWeight: 500,
      fontSize: '16px',
    },
    sblg18: {
      fontWeight: 600,
      fontSize: '18px',
    },
    sbm16: {
      fontWeight: 600,
      fontSize: '16px',
    },
  } as ExtendedTypographyOptions,
} as ThemeOptions;

export default baseTheme;
