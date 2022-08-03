import { Button, ButtonProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React from 'react';
import { Trans } from 'react-i18next';

const StyledTextButton: StyledComponent<any> = styled(Button)<ButtonProps>(({ theme }) => ({
  borderRadius: '12px',
  padding: '8px',
  background: theme.palette.widget['bg-main'],
  textTransform: 'none',
  lineHeight: '19px',
  color: theme.palette.widget['text-primary'],
  '&:hover': {
    background: theme.palette.widget['bg-btn-hover'],
  },
}));

interface Props {
  disabled?: boolean;
  onClick: () => void;
}

const ResetSettingsButton = ({ disabled, onClick }: Props) => {
  return (
    <StyledTextButton sx={{ typography: 'rm16' }} disabled={disabled} onClick={onClick}>
      <Trans>Reset</Trans>
    </StyledTextButton>
  );
};

export default ResetSettingsButton;
