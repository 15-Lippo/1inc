import { Box, useTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import React from 'react';

interface Props {
  error?: boolean;
  sx?: SxProps<Theme>;
}

const WarningIcon = ({ error, sx }: Props) => {
  const theme = useTheme();
  const size = error ? '16' : '12';
  return (
    <Box sx={sx}>
      <svg height={size} width={size} viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M8 0C3.58667 0 0 3.58667 0 8C0 12.4133 3.58667 16 8 16C12.4133 16 16 12.4133 16 8C16 3.58667 12.4133 0 8 0Z"
          fill={error ? theme.palette.widget['icon-08'] : theme.palette.widget['icon-09']}
        />
        <path
          d="M8.00026 3.80017C7.33359 3.80017 7.00073 4.34485 7.00073 4.71818V5.04131L7.33359 9.00017C7.33359 9.3735 7.62692 9.66684 8.00026 9.66684C8.37359 9.66684 8.66692 9.3735 8.66692 9.00017L8.92805 5.04131V4.66687C8.92796 4.28147 8.5063 3.80017 8.00026 3.80017Z"
          fill={theme.palette.widget['icon-06']}
        />
        <path
          d="M8.01325 11.8016C7.66659 11.7749 7.34659 12.1349 7.33325 12.4949C7.33325 12.5082 7.33325 12.5882 7.33325 12.6016C7.33325 12.9616 7.61325 13.2282 7.98659 13.2416H7.99992C8.35992 13.2416 8.65325 12.9216 8.66659 12.5749C8.66659 12.5616 8.66659 12.4282 8.66659 12.4282C8.66659 12.0416 8.38659 11.8016 8.01325 11.8016Z"
          fill={theme.palette.widget['icon-06']}
        />
      </svg>
    </Box>
  );
};

export default WarningIcon;
