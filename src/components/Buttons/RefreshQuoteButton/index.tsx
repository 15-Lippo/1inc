import { IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React, { useState } from 'react';

import { useCountdownQuote } from '../../../store/state/swap/useCountdownQuote';
import { ITheme } from '../../../theme';

const useStyles = makeStyles((theme: ITheme) => ({
  refreshQuoteButton: {
    '&:hover #refresh-button-bg': {
      fill: theme.palette.cool[100],
    },
    '&:active #refresh-arrow': {
      stroke: theme.palette.blue[500],
    },
    '&:disabled #refresh-arrow': {
      stroke: theme.palette.dark[500],
    },
  },
}));

const RefreshQuoteButton = () => {
  const classes = useStyles();
  const [update, setUpdate] = useState<boolean>(false);
  const countdownQuote = useCountdownQuote(update);
  // console.log('countdownQuote: ', countdownQuote);

  return (
    <IconButton
      disableRipple
      className={classes.refreshQuoteButton}
      aria-label="refresh-button"
      onClick={() => setUpdate(!update)}>
      <svg
        id="refresh-button"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          id="refresh-button-bg"
          d="M0 12C0 5.37258 5.37258 0 12 0H24C30.6274 0 36 5.37258 36 12V24C36 30.6274 30.6274 36 24 36H12C5.37258 36 0 30.6274 0 24V12Z"
          fill="#FFFFFF"
        />
        <path
          id="refresh-arrow"
          d="M24.3158 10.8206V14.5129L20.5263 14.5125"
          stroke="black"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
        <path
          id="refresh-arrow"
          d="M25.1575 18.2051C25.1575 22.0574 21.9533 25.1794 17.9996 25.1794C14.0459 25.1794 10.8417 22.0574 10.8417 18.2051C10.8417 14.3528 14.0459 11.2307 17.9996 11.2307C20.1095 11.2307 22.0063 12.1197 23.3162 13.5347C23.5764 13.8161 23.8139 14.1185 24.0248 14.4385"
          stroke="black"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
        />
      </svg>
    </IconButton>
  );
};

export default RefreshQuoteButton;
