import { Box, useTheme } from '@mui/material';
import { Theme } from '@mui/material/styles';
import { SxProps } from '@mui/system';
import React from 'react';

const RouteModalDivider = ({ styles }: { styles?: SxProps<Theme> }) => {
  const theme = useTheme();
  return (
    <Box
      // @ts-ignore: Error type: "Types of property ''&::before'' are incompatible."
      sx={{
        '&::before': {
          content: '""',
          position: 'absolute',
          left: '50%',
          transform: 'translate(-50%, 0)',
          width: '90%',
          height: '1px',
          background: theme.palette.widget['border-gradient'],
          zIndex: 1,
          ...styles,
        },
      }}
    />
  );
};

export default RouteModalDivider;
