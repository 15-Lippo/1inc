import { createTheme, PaletteOptions } from '@mui/material';

import baseTheme from './base-theme';

const CYAN = '#55BCC0';
const RED = '#FE3366';
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
    'input-border': RED,
    'input-border-error': CYAN,

    'bg-main': '#18191B',
    'bg-disabled': DARK_GREY,
    'bg-01': CHARCOAL,
    'bg-02': DARK_GREY,
    'bg-03': RED,
    'bg-03-hover': `${RED}99`,
    'bg-04': CYAN,
    'bg-04-hover': `${CYAN}B2`, // add alpha=B2
    'bg-05': '#3D402F',
    'bg-05-hover': '#E7FC6E66',
    'bg-07': CYAN,

    'bg-main-btn': LIGHT_YELLOW,
    'bg-main-btn-hovered': `${LIGHT_YELLOW}99`,

    'bg-alert-warn': '#FF9C0833',
    'bg-alert-error': '#FF668214',
    'bg-alert': '#576A6B66',

    'text-primary': CREAM_WHITE,
    'text-primary-01': CYAN,
    'text-primary-02': CREAM_WHITE,
    'text-disabled': LIGHT_GREY,
    'text-secondary': LIGHT_GREY,
    'text-successful': '#05D864',

    'text-main-btn-00': '#282B18',
    'text-main-btn-01': CREAM_WHITE,
    'text-main-btn-02': LIGHT_YELLOW,

    'text-warn': YELLOW,
    'text-error': PINK,
    'text-alert': CREAM_WHITE,

    'checkbox-text-00': CYAN,
    'checkbox-text-01': '#999999',
    'checkbox-text-02': WHITE,

    'border-00': '#434343',
    'border-01': DARK_GREY,
    'border-02': LIGHT_YELLOW,

    'btn-text': CYAN,
    'btn-text-hover': '#576A6B66',

    'icon-01': CREAM_WHITE,
    'icon-02': LIGHT_GREY,
    'icon-05': LIGHT_GREY,
    'icon-06': WHITE,
    'icon-07': LIGHT_YELLOW,
    'icon-08': PINK,
    'icon-09': YELLOW,
    'icon-10': CYAN,

    'bg-tooltip': DARK_GREY,
  },
};

const theme = createTheme(baseTheme, { palette: nereusPalette });

export default theme;
