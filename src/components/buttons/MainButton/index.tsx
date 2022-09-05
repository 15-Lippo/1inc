import { LoadingButton } from '@mui/lab';
import { CircularProgress, Theme, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import { SxProps } from '@mui/system';
import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAppSelector } from '../../../store';
import { Field } from '../../../types';
import { WalletIcon } from '../../icons';

export enum MainButtonType {
  Connect,
  EnterAmount,
  Swap,
  Approve,
  Refresh,
  MustRefresh,
  Confirm,
  Close,
  InsufficientBalance,
  InsufficientNativeTokenBalance,
  Loading,
  Explorer,
  Import,
  Error,
}

const disabledStyle = (theme: Theme) => ({
  '&:disabled': {
    background: theme.palette.widget['bg-disabled'],
    color: theme.palette.widget['text-disabled'],
  },
});

const primaryActionStyle = (theme: Theme) => ({
  background: theme.palette.widget['bg-main-btn'],
  color: theme.palette.widget['text-main-btn-00'],
  '&:hover': {
    background: theme.palette.widget['bg-main-btn-hovered'],
  },
  ...disabledStyle(theme),
});

const secondaryActionStyle = (theme: Theme) => ({
  background: theme.palette.widget['bg-04'],
  color: theme.palette.widget['text-main-btn-01'],
  '&:hover': {
    background: theme.palette.widget['bg-04-hover'],
  },
  ...disabledStyle(theme),
});

const utilityActionStyle = (theme: Theme) => ({
  background: theme.palette.widget['bg-05'],
  color: theme.palette.widget['text-main-btn-02'],
  '&:hover': {
    background: theme.palette.widget['bg-05-hover'],
  },
  ...disabledStyle(theme),
});

const styledButtonType = {
  [MainButtonType.Swap]: primaryActionStyle,
  [MainButtonType.Approve]: primaryActionStyle,
  [MainButtonType.Confirm]: primaryActionStyle,
  [MainButtonType.Import]: secondaryActionStyle,
  [MainButtonType.Refresh]: secondaryActionStyle,
  [MainButtonType.Explorer]: secondaryActionStyle,
  [MainButtonType.Connect]: utilityActionStyle,
  [MainButtonType.Close]: utilityActionStyle,
  [MainButtonType.Loading]: utilityActionStyle,
  [MainButtonType.InsufficientNativeTokenBalance]: disabledStyle,
  [MainButtonType.InsufficientBalance]: disabledStyle,
  [MainButtonType.EnterAmount]: disabledStyle,
  [MainButtonType.Error]: disabledStyle,
  [MainButtonType.MustRefresh]: (theme: Theme) => ({
    background: theme.palette.widget['bg-03'],
    color: theme.palette.widget['text-main-btn-01'],
    '&:hover': {
      background: theme.palette.widget['bg-03-hover'],
    },
    ...disabledStyle(theme),
  }),
};

const StyledMainButton: StyledComponent<any> = styled(LoadingButton)<{
  typestyledbutton: keyof typeof styledButtonType;
}>(({ theme, typestyledbutton }) => styledButtonType[typestyledbutton](theme));

interface MainButtonProps {
  type: MainButtonType;
  disabled?: boolean;
  onClick?: () => void;
  rateExpired?: boolean;
  explorerName?: string;
  sx?: SxProps;
}

export const MainButton = ({ type, disabled, onClick, rateExpired, explorerName, sx }: MainButtonProps) => {
  const { t } = useTranslation();
  const { token, quoteError } = useAppSelector((state) => ({
    quoteError: state.swap.quoteError,
    token: state.tokens.tokens[state.swap[Field.INPUT]],
  }));

  const textButtonType = {
    [MainButtonType.Connect]: t('Connect wallet'),
    [MainButtonType.EnterAmount]: t('Enter amount to swap'),
    [MainButtonType.Swap]: t('Swap'),
    [MainButtonType.Approve]: t('Give permission to swap', { symbol: token && token.symbol }),
    [MainButtonType.Refresh]: t(`Refresh rate`),
    [MainButtonType.MustRefresh]: t(`Refresh rate`),
    [MainButtonType.Confirm]: t(`Confirm swap`),
    [MainButtonType.Close]: t(`Close`),
    [MainButtonType.InsufficientBalance]: t('Insufficient token balance', { symbol: token && token.symbol }),
    [MainButtonType.InsufficientNativeTokenBalance]: t(`Insufficient native token balance`),
    [MainButtonType.Loading]: '',
    [MainButtonType.Explorer]: t('View on', { explorerName }),
    [MainButtonType.Import]: t(`Import`),
    [MainButtonType.Error]: quoteError?.message,
  };

  return (
    <StyledMainButton
      typestyledbutton={rateExpired ? MainButtonType.MustRefresh : type}
      sx={{
        ...sx,
        padding: '12px 0',
        borderRadius: '14px',
        textTransform: 'none',
        boxShadow: 'none',
        '&:hover': {
          boxShadow: 'none',
        },
      }}
      variant="contained"
      loading={type === MainButtonType.Loading}
      loadingIndicator={<CircularProgress sx={{ color: 'widget.icon-10' }} size={30} />}
      disabled={
        type === MainButtonType.Error ||
        type === MainButtonType.EnterAmount ||
        type === MainButtonType.InsufficientBalance ||
        type === MainButtonType.InsufficientNativeTokenBalance ||
        disabled
      }
      onClick={onClick}
      startIcon={type === MainButtonType.Connect && <WalletIcon />}
      fullWidth>
      <Typography variant="sbm16">{textButtonType[type]}</Typography>
    </StyledMainButton>
  );
};
