import { LoadingButton } from '@mui/lab';
import { CircularProgress, Theme, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useEffect, useState } from 'react';

import { useAppSelector } from '../../../store/hooks';
import { Field } from '../../../store/state/swap/swapSlice';

export enum MainButtonType {
  Connect,
  EnterAmount,
  Swap,
  Approve,
  Refresh,
  Confirm,
  Close,
  InsufficientBalance,
  Loading,
}

const styledButtonType = {
  [MainButtonType.Connect]: (theme: Theme) => ({
    background: theme.palette.blue[16],
    color: theme.palette.blue[500],
    '&:hover': {
      background: theme.palette.blue[40],
    },
  }),
  [MainButtonType.EnterAmount]: (theme: Theme) => ({
    '&:disabled': {
      background: theme.palette.cool[100],
      color: theme.palette.dark[500],
    },
  }),
  [MainButtonType.Swap]: (theme: Theme) => ({
    background: theme.palette.gradient[500],
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.gradient[52],
    },
    '&:disabled': {
      background: theme.palette.cool[100],
      color: theme.palette.dark[500],
    },
  }),
  [MainButtonType.Approve]: (theme: Theme) => ({
    background: theme.palette.gradient[500],
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.gradient[52],
    },
  }),
  [MainButtonType.Refresh]: (theme: Theme, rateExpired?: boolean) => ({
    background: rateExpired ? theme.palette.red[500] : theme.palette.blue[500],
    color: theme.palette.common.white,
    '&:hover': {
      background: rateExpired ? theme.palette.red[500] : theme.palette.blue[500],
    },
  }),
  [MainButtonType.Confirm]: (theme: Theme) => ({
    background: theme.palette.gradient[500],
    color: theme.palette.common.white,
    '&:hover': {
      background: theme.palette.gradient[52],
    },
    '&:disabled': {
      background: theme.palette.cool[100],
      color: theme.palette.dark[500],
    },
  }),
  [MainButtonType.Close]: (theme: Theme) => ({
    background: theme.palette.blue[16],
    color: theme.palette.blue[500],
    '&:hover': {
      background: theme.palette.blue[40],
    },
  }),
  [MainButtonType.InsufficientBalance]: (theme: Theme) => ({
    '&:disabled': {
      background: theme.palette.cool[100],
      color: theme.palette.dark[500],
    },
  }),
  [MainButtonType.Loading]: (theme: Theme) => ({
    background: theme.palette.blue[16],
    color: theme.palette.blue[500],
    '&:disabled': {
      background: theme.palette.blue[16],
    },
  }),
};

const StyledMainButton = styled(LoadingButton)<{
  typeStyledButton: keyof typeof styledButtonType;
  rateExpired?: boolean;
}>(({ theme, typeStyledButton, rateExpired }) =>
  styledButtonType[typeStyledButton](theme, rateExpired)
);

export interface MainButtonProps {
  type: MainButtonType;
  disabled?: boolean;
  onClick?: () => void;
  rateExpired?: boolean;
}

const MainButton = ({ type, disabled, onClick, rateExpired }: MainButtonProps) => {
  const [isDisabled, setIsDisabled] = useState<boolean>(false);
  const { token } = useAppSelector((state) => {
    return {
      token: state.tokens.tokens[state.swap[Field.INPUT]],
    };
  });

  useEffect(() => {
    if (
      type === MainButtonType.EnterAmount ||
      type === MainButtonType.InsufficientBalance ||
      disabled
    ) {
      setIsDisabled(true);
    }
  }, [type]);

  const ConnectWalletIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M15.385 19.5067H3.66318C2.69168 19.5067 1.75996 19.1116 1.07301 18.4084C0.38605 17.7051 0.00012207 16.7513 0.00012207 15.7567V5.25671C0.00012207 5.0578 0.0773077 4.86704 0.214699 4.72638C0.35209 4.58573 0.538433 4.50671 0.732734 4.50671H15.385C16.3565 4.50671 17.2882 4.9018 17.9751 5.60506C18.6621 6.30832 19.048 7.26215 19.048 8.25671V15.7567C19.048 16.7513 18.6621 17.7051 17.9751 18.4084C17.2882 19.1116 16.3565 19.5067 15.385 19.5067ZM1.46535 6.00671V15.7567C1.46535 16.3535 1.6969 16.9257 2.10908 17.3477C2.52125 17.7697 3.08028 18.0067 3.66318 18.0067H15.385C15.9679 18.0067 16.5269 17.7697 16.9391 17.3477C17.3512 16.9257 17.5828 16.3535 17.5828 15.7567V8.25671C17.5828 7.65998 17.3512 7.08768 16.9391 6.66572C16.5269 6.24377 15.9679 6.00671 15.385 6.00671H1.46535Z"
        fill="#2F8AF5"
      />
      <path
        d="M16.8501 6.00675C16.6558 6.00675 16.4695 5.92773 16.3321 5.78708C16.1947 5.64643 16.1175 5.45566 16.1175 5.25675V3.19425C16.1316 2.93152 16.0875 2.66893 15.9885 2.42608C15.8896 2.18324 15.7383 1.9664 15.5461 1.79175C15.3734 1.65927 15.1734 1.5688 14.9614 1.52722C14.7494 1.48563 14.531 1.49402 14.3226 1.55175L2.03674 4.40925C1.87148 4.44735 1.72422 4.54291 1.62003 4.67965C1.51584 4.8164 1.46117 4.98588 1.4653 5.15925C1.4653 5.35816 1.38812 5.54893 1.25073 5.68958C1.11334 5.83023 0.926993 5.90925 0.732693 5.90925C0.538392 5.90925 0.352049 5.83023 0.214658 5.68958C0.0772666 5.54893 8.10124e-05 5.35816 8.10124e-05 5.15925C-0.00421756 4.64654 0.162664 4.14771 0.473092 3.74535C0.78352 3.34299 1.21887 3.06124 1.70707 2.94675L14.0003 0.0892499C14.4231 -0.0201935 14.8647 -0.0291062 15.2914 0.0631946C15.7181 0.155495 16.1185 0.34656 16.4619 0.62175C16.825 0.937231 17.1142 1.33219 17.3082 1.77744C17.5022 2.2227 17.596 2.70689 17.5828 3.19425V5.25675C17.5828 5.45566 17.5056 5.64643 17.3682 5.78708C17.2308 5.92773 17.0444 6.00675 16.8501 6.00675Z"
        fill="#2F8AF5"
      />
      <path
        d="M18.3154 15.0067H13.1871C12.4099 15.0067 11.6645 14.6906 11.115 14.128C10.5654 13.5654 10.2567 12.8024 10.2567 12.0067C10.2567 11.2111 10.5654 10.448 11.115 9.88539C11.6645 9.32278 12.4099 9.00671 13.1871 9.00671H18.3154C18.5097 9.00671 18.696 9.08573 18.8334 9.22638C18.9708 9.36704 19.048 9.5578 19.048 9.75671V14.2567C19.048 14.4556 18.9708 14.6464 18.8334 14.787C18.696 14.9277 18.5097 15.0067 18.3154 15.0067ZM13.1871 10.5067C12.7985 10.5067 12.4258 10.6647 12.151 10.9461C11.8762 11.2274 11.7219 11.6089 11.7219 12.0067C11.7219 12.4045 11.8762 12.7861 12.151 13.0674C12.4258 13.3487 12.7985 13.5067 13.1871 13.5067H17.5828V10.5067H13.1871Z"
        fill="#2F8AF5"
      />
    </svg>
  );

  const textButtonType = {
    [MainButtonType.Connect]: 'Connect wallet',
    [MainButtonType.EnterAmount]: 'Enter amount to swap',
    [MainButtonType.Swap]: 'Swap',
    [MainButtonType.Approve]: `Give permission to swap ${token && token.symbol}`,
    [MainButtonType.Refresh]: 'Refresh rate',
    [MainButtonType.Confirm]: 'Confirm swap',
    [MainButtonType.Close]: 'Close',
    [MainButtonType.InsufficientBalance]: `Insufficient ${token && token.symbol} balance`,
    [MainButtonType.Loading]: '',
  };

  return (
    <StyledMainButton
      typeStyledButton={type}
      rateExpired={rateExpired}
      sx={{
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
      loadingIndicator={<CircularProgress size={30} />}
      disabled={isDisabled}
      onClick={onClick}
      startIcon={type === MainButtonType.Connect && ConnectWalletIcon}
      fullWidth>
      <Typography variant="sbm16">{textButtonType[type]}</Typography>
    </StyledMainButton>
  );
};

export default MainButton;
