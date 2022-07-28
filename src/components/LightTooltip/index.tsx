import { styled } from '@mui/material/styles';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { StyledComponent } from '@mui/styles';
import React from 'react';

export const LightTooltip: StyledComponent<TooltipProps> = styled(({ children, className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }}>
    <span>{children}</span>
  </Tooltip>
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    color: theme.palette.widget['text-primary'],
    backgroundColor: theme.palette.widget['bg-tooltip'],
    borderRadius: '8px',
    fontSize: 12,
    filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.17))',
  },
  [`& .${tooltipClasses.arrow}`]: {
    '&::before': {
      backgroundColor: theme.palette.widget['bg-tooltip'],
      filter: 'drop-shadow(0px 4px 10px rgba(0, 0, 0, 0.17))',
    },
  },
}));
