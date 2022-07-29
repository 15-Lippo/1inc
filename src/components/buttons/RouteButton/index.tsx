import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import { ethereumApi } from '@yozh-io/1inch-widget-api-client';
import React from 'react';

import { Token } from '../../../store/state/tokens/tokensSlice';
import { RouteArrow, RouteIcon } from '../../icons';

const StyledRouteButton: StyledComponent<any> = styled(Button)<ButtonProps>(({ theme }) => ({
  transition: 'none',
  display: 'flex',
  alignItems: 'center',
  columnGap: '5px',
  height: '19px',
  padding: 0,
  background: 'none',
  lineHeight: '100%',
  textTransform: 'none',
  color: theme.palette.widget['text-secondary'],
  '& .MuiButton-endIcon': {
    margin: '0 0 0 5px',
  },
  '&:hover': {
    background: 'none',
    color: theme.palette.widget['text-primary'],
  },
  '&:hover svg path': {
    fill: theme.palette.widget['text-primary'],
  },
  '&:hover .MuiButton-endIcon svg path': {
    fill: theme.palette.widget['text-primary'],
  },
}));

interface RouteButtonProps {
  tokens: { [key: string]: Token };
  inputTokenSymbol: string;
  protocols: any;
  onClick: () => void;
  totalRouteSteps: number;
}

const RouteButton = ({ tokens, inputTokenSymbol, protocols, onClick, totalRouteSteps }: RouteButtonProps) => {
  const chainSteps =
    protocols?.length &&
    protocols[0].flatMap((step: ethereumApi.PathViewDto[], index: number) => (
      <React.Fragment key={index}>
        <RouteArrow />
        {tokens[step[0].toTokenAddress]?.symbol}
      </React.Fragment>
    ));

  return (
    <StyledRouteButton sx={{ typography: 'rxs12' }} onClick={onClick} endIcon={<RouteIcon />}>
      {protocols?.length > 1 ? (
        <React.Fragment>{totalRouteSteps} steps in the route</React.Fragment>
      ) : (
        <React.Fragment>
          {inputTokenSymbol}
          {chainSteps}
        </React.Fragment>
      )}
    </StyledRouteButton>
  );
};

export default RouteButton;
