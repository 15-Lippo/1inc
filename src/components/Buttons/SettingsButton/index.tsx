import { IconButton } from '@mui/material';
import { makeStyles } from '@mui/styles';
import React from 'react';

import { ITheme } from '../../../theme';

const useStyles = makeStyles((theme: ITheme) => ({
  backButton: {
    '&:hover #settings-button #background-settings': {
      fill: theme.palette.cool[100],
    },
    '&:active #settings-button #settings-icon': {
      fill: theme.palette.blue[500],
    },
    '&:disabled #settings-button #settings-icon': {
      fill: theme.palette.dark[500],
    },
  },
}));

interface Props {
  disabled?: boolean;
  onClick: () => void;
}

const SettingsButton = ({ disabled, onClick }: Props) => {
  const classes = useStyles();

  return (
    <IconButton
      disabled={disabled}
      disableRipple
      className={classes.backButton}
      aria-label="settings-button"
      onClick={onClick}>
      <svg
        id="settings-button"
        width="36"
        height="36"
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          id="background-settings"
          d="M0 12C0 5.37258 5.37258 0 12 0H24C30.6274 0 36 5.37258 36 12V24C36 30.6274 30.6274 36 24 36H12C5.37258 36 0 30.6274 0 24V12Z"
          fill="white"
        />
        <path
          id="settings-icon"
          d="M19.4887 19.9375L8.8125 19.9375C8.3575 19.9375 8 20.295 8 20.75C8 21.205 8.3575 21.5625 8.8125 21.5625L19.4887 21.5625C19.8462 22.96 21.1138 24 22.625 24C24.1362 24 25.4038 22.96 25.7612 21.5625H26.6875C27.1425 21.5625 27.5 21.205 27.5 20.75C27.5 20.295 27.1425 19.9375 26.6875 19.9375H25.7612C25.4038 18.54 24.1362 17.5 22.625 17.5C21.1138 17.5 19.8462 18.54 19.4887 19.9375ZM24.25 20.75C24.25 21.6437 23.5188 22.375 22.625 22.375C21.7312 22.375 21 21.6437 21 20.75C21 19.8562 21.7312 19.125 22.625 19.125C23.5188 19.125 24.25 19.8562 24.25 20.75Z"
          fill="black"
        />
        <path
          id="settings-icon"
          d="M12.875 11C11.3637 11 10.0962 12.04 9.73875 13.4375H8.8125C8.3575 13.4375 8 13.795 8 14.25C8 14.705 8.3575 15.0625 8.8125 15.0625H9.73875C10.0962 16.46 11.3637 17.5 12.875 17.5C14.3863 17.5 15.6537 16.46 16.0112 15.0625L26.6875 15.0625C27.1425 15.0625 27.5 14.705 27.5 14.25C27.5 13.795 27.1425 13.4375 26.6875 13.4375L16.0112 13.4375C15.6537 12.04 14.3863 11 12.875 11ZM14.5 14.25C14.5 15.1437 13.7688 15.875 12.875 15.875C11.9813 15.875 11.25 15.1437 11.25 14.25C11.25 13.3562 11.9813 12.625 12.875 12.625C13.7688 12.625 14.5 13.3562 14.5 14.25Z"
          fill="black"
        />
      </svg>
    </IconButton>
  );
};

SettingsButton.defaultProps = {
  disabled: false,
};

export default SettingsButton;
