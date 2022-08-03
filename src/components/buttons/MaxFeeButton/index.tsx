import { Button, ButtonProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import _ from 'lodash';
import React from 'react';
import { useTranslation } from 'react-i18next';

const StyledTextButton: StyledComponent<any> = styled(Button)<ButtonProps>(({ theme }) => ({
  padding: 0,
  background: theme.palette.widget['bg-main'],
  textTransform: 'none',
  color: theme.palette.widget['text-secondary'],
  '&:hover': {
    background: theme.palette.widget['bg-main'],
    color: theme.palette.widget['text-primary'],
  },
}));

interface Props {
  value: string;
  onClick: () => void;
}

const MaxFeeButton = ({ value, onClick }: Props) => {
  const { t } = useTranslation();
  return (
    <StyledTextButton onClick={onClick}>
      <Typography variant="rxs12">{t('Estimated high') + `: ${value} Gwei`}</Typography>
    </StyledTextButton>
  );
};

export default React.memo(MaxFeeButton, (prevProps, nextProps) => _.isEqual(prevProps, nextProps));
