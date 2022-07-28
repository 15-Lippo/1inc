import { IconButton, IconButtonProps, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React from 'react';

const StyledIconButton: StyledComponent<any> = styled(IconButton)<IconButtonProps>(({ theme }) => ({
  '&:hover #close-button path': {
    fill: theme.palette.widget['bg-btn-hover'],
  },
  '&:active #close-button #cross': {
    stroke: theme.palette.widget['icon-01'],
  },
  '&:disabled #close-button #cross': {
    stroke: theme.palette.widget['icon-02'],
  },
}));

interface Props {
  disabled?: boolean;
  onClick: () => void;
  size?: '16' | '28' | '36';
}

const CloseButton = ({ disabled, onClick, size }: Props) => {
  const theme = useTheme();
  const crossColor = size === '36' ? theme.palette.widget['icon-01'] : theme.palette.widget['icon-02'];
  return (
    <StyledIconButton disabled={disabled} disableRipple aria-label="close" onClick={onClick}>
      <svg
        id="close-button"
        width={size}
        height={size}
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg">
        <path
          d="M0 12C0 5.37258 5.37258 0 12 0H24C30.6274 0 36 5.37258 36 12V24C36 30.6274 30.6274 36 24 36H12C5.37258 36 0 30.6274 0 24V12Z"
          fill="none"
        />
        <path
          id="cross"
          d="M22.7278 13.2427L14.2426 21.728"
          stroke={crossColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          id="cross"
          d="M22.7278 21.7279L14.2426 13.2426"
          stroke={crossColor}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </StyledIconButton>
  );
};

CloseButton.defaultProps = {
  disabled: false,
  size: '36',
};

export default CloseButton;
