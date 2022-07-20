import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React from 'react';

const StyledTextButton: StyledComponent<any> = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px',
  background: theme.palette.background.default,
  textTransform: 'none',
  lineHeight: '19px',
  color: theme.palette.dark[900],
  '&:hover': {
    background: theme.palette.cool[100],
  },
}));

interface Props {
  disabled?: boolean;
  onClick: () => void;
}

const ResetSettingsButton = ({ disabled, onClick }: Props) => {
  return (
    <StyledTextButton sx={{ typography: 'rm16' }} disabled={disabled} onClick={onClick}>
      Reset
    </StyledTextButton>
  );
};

export default ResetSettingsButton;
