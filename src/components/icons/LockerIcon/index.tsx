import { useTheme } from '@mui/material';
import React from 'react';

const LockerIcon = () => {
  const theme = useTheme();
  return (
    <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M9.81816 6.875H2.18179C1.5793 6.875 1.09088 7.43464 1.09088 8.125V12.5C1.09088 13.1904 1.5793 13.75 2.18179 13.75H9.81816C10.4206 13.75 10.9091 13.1904 10.9091 12.5V8.125C10.9091 7.43464 10.4206 6.875 9.81816 6.875Z"
        stroke={theme.palette.widget['icon-09']}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M3.27271 6.875V4.375C3.27271 3.5462 3.56004 2.75134 4.0715 2.16529C4.58297 1.57924 5.27666 1.25 5.99998 1.25C6.7233 1.25 7.41699 1.57924 7.92845 2.16529C8.43991 2.75134 8.72725 3.5462 8.72725 4.375V6.875"
        stroke={theme.palette.widget['icon-09']}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default LockerIcon;
