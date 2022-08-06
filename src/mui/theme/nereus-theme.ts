import { createTheme, PaletteOptions } from '@mui/material';

import baseTheme from './base-theme';

const CYAN = '#55BCC0';
const CHARCOAL = '#141414';
const DARK_GREY = '#303236';
const LIGHT_YELLOW = '#E7FC6E';
const CREAM_WHITE = '#FBFBFB';
const LIGHT_GREY = '#A3A3A3';
const WHITE = '#FFFFFF';
const PINK = '#FF6682';
const YELLOW = '#FDD33F';

const nereusPalette: PaletteOptions = {
  widget: {
    'input-primary-text': CREAM_WHITE,
    'input-secondary-text': LIGHT_GREY,
    'input-placeholder': LIGHT_GREY,
    'input-bg': CHARCOAL,
    'input-bg-01': DARK_GREY,
    'input-border': '#55BCC0',
    'input-border-error': '#D85F75',
    'input-border-warn': '#FF9C08',

    'bg-main': '#18191B',
    'bg-disabled': DARK_GREY,
    'bg-01': CHARCOAL,
    'bg-02': DARK_GREY,
    'bg-03': '#CA405C',
    'bg-03-hover': '#9F344A',
    'bg-04': CYAN,
    'bg-04-hover': '#3E9194',
    'bg-05': '#3D402F',
    'bg-05-hover': '#55593E',
    'bg-07': CYAN,

    'bg-main-btn': LIGHT_YELLOW,
    'bg-main-btn-hovered': '#9FA94A',

    'bg-alert-warn': '#2F2A23',
    'bg-alert-error': '#2A1F23',
    'bg-alert': DARK_GREY,

    'text-primary': CREAM_WHITE,
    'text-primary-01': CYAN,
    'text-primary-02': CREAM_WHITE,
    'text-disabled': LIGHT_GREY,
    'text-secondary': LIGHT_GREY,
    'text-successful': '#83D16F',

    'text-main-btn-00': '#282B18',
    'text-main-btn-01': CREAM_WHITE,
    'text-main-btn-02': LIGHT_YELLOW,

    'text-warn': YELLOW,
    'text-error': PINK,
    'text-alert': CREAM_WHITE,

    'checkbox-00': CYAN,
    'checkbox-01': '#999999',
    'checkbox-02': WHITE,

    'border-00': '#434343',
    'border-01': DARK_GREY,
    'border-02': LIGHT_YELLOW,
    'border-03': LIGHT_GREY,
    'border-gradient': 'radial-gradient(circle, #A3A3A3 0%, #A3A3A3 15%, rgba(163, 163, 163, 0) 100%)',

    'btn-text': CYAN,
    'btn-text-hover': '#7BE1E4',
    'bg-btn-hover': DARK_GREY,

    'icon-01': CREAM_WHITE,
    'icon-02': LIGHT_GREY,
    'icon-05': LIGHT_GREY,
    'icon-06': WHITE,
    'icon-07': LIGHT_YELLOW,
    'icon-08': PINK,
    'icon-09': YELLOW,
    'icon-10': CYAN,

    'bg-tooltip': DARK_GREY,

    'skeleton-00': DARK_GREY,
    'skeleton-01': DARK_GREY,
  },
};

const theme = createTheme(baseTheme, { palette: nereusPalette });

export default theme;
