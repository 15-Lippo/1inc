import { useTheme } from '@mui/material';
import React from 'react';

const TxFailedIcon = () => {
  const theme = useTheme();
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M75.4594 12.8198L11.8198 76.4594"
        stroke={theme.palette.widget['icon-08']}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M75.4592 76.4597L11.8196 12.8201"
        stroke={theme.palette.widget['icon-08']}
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default TxFailedIcon;
