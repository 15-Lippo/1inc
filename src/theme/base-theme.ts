import { ThemeOptions } from '@mui/material';

import { ExtendedPaletteOptions, ExtendedTypographyOptions } from './theme';

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
  palette: {
    gradientEth: 'linear-gradient(76.32deg, rgba(63, 133, 238, 0.9) 0.29%, rgba(73, 91, 252, 0.84) 92.07%)',
    gradientBnb: 'linear-gradient(75.38deg, rgba(83, 89, 97, 0.8845) -25.45%, #3C3E46 107.61%)',
    gradientPolygon: 'linear-gradient(80.26deg, rgba(96, 39, 192, 0.8845) 25.41%, rgba(130, 71, 229, 0.74) 58.36%)',
    gradientArbitrum: 'linear-gradient(80.1deg, rgba(40, 160, 240, 0.72) 3.59%, #0678C4 57.09%)',
    gradientOptimism: 'linear-gradient(260.64deg, #C10A1F 40.48%, rgba(233, 4, 29, 0.65) 95.18%)',
    gradientAvalanche: 'linear-gradient(80.12deg, rgba(180, 45, 40, 0.8845) 3.12%, rgba(245, 73, 66, 0.85) 59.84%)',
    gradientGnosis: 'linear-gradient(90deg, #037A5B 0%, #22B698 100%)',
    gradientFantom: 'linear-gradient(90deg, rgba(9, 21, 237, 0.83) 0%, rgba(50, 107, 246, 0.8845) 100%)',
  } as ExtendedPaletteOptions,
} as ThemeOptions;

export default baseTheme;
