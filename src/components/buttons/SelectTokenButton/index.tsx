import { Avatar, Button, useTheme } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import React from 'react';

import { useAppSelector } from '../../../store/hooks';
import { Field } from '../../../types';

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
  const { token } = useAppSelector((state) => {
    return {
      token: state.tokens.tokens[state.swap[field]],
    };
  });

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
      startIcon={<Avatar src={token.logoURI} style={{ width: 24, height: 24 }} />}
      endIcon={
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            id="select-down-arrow-button"
            d="M9.6364 1.6364C9.98787 1.28492 9.98787 0.715076 9.6364 0.363604C9.28492 0.0121321 8.71508 0.012132 8.3636 0.363604L9.6364 1.6364ZM5 5L4.3636 5.6364C4.53239 5.80518 4.76131 5.9 5 5.9C5.23869 5.9 5.46761 5.80518 5.6364 5.6364L5 5ZM1.6364 0.363604C1.28492 0.0121317 0.715076 0.0121317 0.363604 0.363604C0.0121317 0.715075 0.0121317 1.28492 0.363604 1.6364L1.6364 0.363604ZM8.3636 0.363604L4.3636 4.3636L5.6364 5.6364L9.6364 1.6364L8.3636 0.363604ZM5.6364 4.3636L1.6364 0.363604L0.363604 1.6364L4.3636 5.6364L5.6364 4.3636Z"
            fill={theme.palette.widget['icon-02']}
          />
        </svg>
      }>
      {token.symbol}
    </StyledSelectTokenButton>
  ) : null;
};

export default SelectTokenButton;
