import { useTheme } from '@mui/material';
import React from 'react';

const NoLogoURI = () => {
  const theme = useTheme();
  return (
    <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M0 20C0 8.95431 8.95431 0 20 0V0C31.0457 0 40 8.95431 40 20V20C40 31.0457 31.0457 40 20 40V40C8.95431 40 0 31.0457 0 20V20Z"
        fill={theme.palette.widget['bg-05']}
        fillOpacity="0.5"
      />
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M9.31042 20.0001C9.31042 14.0964 14.0963 9.31055 20 9.31055C22.5917 9.31055 24.968 10.2329 26.8185 11.7673L11.7671 26.8187C10.2328 24.9681 9.31042 22.5918 9.31042 20.0001ZM13.1814 28.2329C15.0319 29.7673 17.4082 30.6896 20 30.6896C25.9036 30.6896 30.6895 25.9038 30.6895 20.0001C30.6895 17.4083 29.7671 15.032 28.2328 13.1815L13.1814 28.2329ZM20 7.31055C12.9917 7.31055 7.31042 12.9918 7.31042 20.0001C7.31042 27.0083 12.9917 32.6896 20 32.6896C27.0082 32.6896 32.6895 27.0083 32.6895 20.0001C32.6895 12.9918 27.0082 7.31055 20 7.31055Z"
        fill={theme.palette.widget['icon-05']}
      />
    </svg>
  );
};

export default NoLogoURI;
