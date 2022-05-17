import { IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

import { ITheme } from '../../../theme';

const useStyles = makeStyles((theme: ITheme) => ({
  closeButton: {
    '&:hover #close-button path': {
      fill: theme.palette.cool[100],
    },
    '&:active #close-button #cross': {
      stroke: theme.palette.blue[500],
    },
    '&:disabled #close-button #cross': {
      stroke: theme.palette.dark[500],
    },
  },
}));

interface Props {
  disabled?: boolean;
  onClick: () => void;
}

const CloseButton = ({ disabled, onClick }: Props) => {
  const classes = useStyles();

  return (
    <IconButton
      disabled={disabled}
      disableRipple
      className={classes.closeButton}
      aria-label="close"
      onClick={onClick}>
      <svg
        id="close-button"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 12C0 5.37258 5.37258 0 12 0H24C30.6274 0 36 5.37258 36 12V24C36 30.6274 30.6274 36 24 36H12C5.37258 36 0 30.6274 0 24V12Z"
          fill="white"
        />
        <path
          id="cross"
          d="M22.7278 13.2427L14.2426 21.728"
          stroke="#15151F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="cross"
          d="M22.7278 21.7279L14.2426 13.2426"
          stroke="#15151F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </IconButton>
  );
};

CloseButton.defaultProps = {
  disabled: false,
};

export default CloseButton;
