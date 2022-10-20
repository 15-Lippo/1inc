import { useTheme } from '@mui/material';
import React from 'react';

const NoLogoURI = () => {
  const theme = useTheme();
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="40" height="40" rx="20" fill={theme.palette.widget['bg-05']} fillOpacity="0.16" />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.31046 20.0001C9.31046 14.0964 14.0963 9.31052 20 9.31052C22.5917 9.31052 24.968 10.2329 26.8186 11.7672L11.7672 26.8186C10.2328 24.9681 9.31046 22.5918 9.31046 20.0001ZM13.1814 28.2328C15.0319 29.7672 17.4082 30.6896 20 30.6896C25.9037 30.6896 30.6895 25.9037 30.6895 20.0001C30.6895 17.4083 29.7672 15.032 28.2328 13.1814L13.1814 28.2328ZM20 7.31052C12.9918 7.31052 7.31046 12.9918 7.31046 20.0001C7.31046 27.0083 12.9918 32.6896 20 32.6896C27.0082 32.6896 32.6895 27.0083 32.6895 20.0001C32.6895 12.9918 27.0082 7.31052 20 7.31052Z"
        fill={theme.palette.widget['icon-05']}
      />
    </svg>
  );
};

export default NoLogoURI;
