import { Avatar, Button, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React from 'react';

import { useAppSelector } from '../../../store';
import { Field } from '../../../types';
import { NoLogoURI, SelectDownArrowButton } from '../../icons';

interface SelectedTokenProps {
  field: Field;
  onClick: () => void;
}

const StyledSelectTokenButton: StyledComponent<any> = styled(Button)<{ field?: Field }>(({ theme, field }) => ({
  '&:hover #select-down-arrow-button': {
    fill: theme.palette.widget['icon-10'],
  },
  padding: '8px 15px',
  width: 'fit-content',
  backgroundColor: field === Field.INPUT ? theme.palette.widget['bg-01'] : theme.palette.widget['bg-main'],
  color: theme.palette.widget['text-primary'],
  borderRadius: '14px',
  '&:hover': {
    backgroundColor: field === Field.INPUT ? theme.palette.widget['bg-main'] : theme.palette.widget['bg-01'],
  },
}));

const SelectTokenButton = ({ field, onClick }: SelectedTokenProps) => {
  const theme = useTheme();
  const token = useAppSelector((state) => state.tokens.tokens[state.swap[field]]);

  return token ? (
    <StyledSelectTokenButton
      sx={{
        minWidth: 'fit-content',
        typography: 'rlg18',
        textTransform: 'none',
      }}
      field={field}
      variant="text"
      onClick={onClick}
      startIcon={
        <Avatar src={token.logoURI} style={{ width: 24, height: 24 }}>
          <NoLogoURI />
        </Avatar>
      }
      endIcon={<SelectDownArrowButton color={theme.palette.widget['icon-02']} />}>
      {token.symbol}
    </StyledSelectTokenButton>
  ) : null;
};

export default SelectTokenButton;
