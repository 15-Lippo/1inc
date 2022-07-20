import { Button, ButtonProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import _ from 'lodash';
import React from 'react';

const StyledTextButton: StyledComponent<any> = styled(Button)<ButtonProps>(({ theme }) => ({
  padding: 0,
  background: theme.palette.background.default,
  textTransform: 'none',
  color: theme.palette.dark[700],
  '&:hover': {
    background: theme.palette.background.default,
    color: theme.palette.dark[900],
  },
}));

interface Props {
  value: string;
  onClick: () => void;
}

const MaxFeeButton = ({ value, onClick }: Props) => {
  return (
    <StyledTextButton onClick={onClick}>
      <Typography variant="rxs12">{`Estimated high: ${value} Gwei`}</Typography>
    </StyledTextButton>
  );
};

export default React.memo(MaxFeeButton, (prevProps, nextProps) => _.isEqual(prevProps, nextProps));
