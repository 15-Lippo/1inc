import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { StyledComponent } from '@mui/styles';
import React from 'react';

export const LightTooltip: StyledComponent<TooltipProps> = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.dark[900],
    borderRadius: '8px',
    fontSize: 12,
    filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.17))',
  },
  [`& .${tooltipClasses.arrow}`]: {
    '&::before': {
      backgroundColor: theme.palette.common.white,
      filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.17))',
    },
  },
}));
