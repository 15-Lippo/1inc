import { Box, Stack, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { useWeb3React } from '@web3-react/core';
import React from 'react';
import { useTranslation } from 'react-i18next';

import {
  BackButton,
  CloseButton,
  RefreshQuoteButton,
  ResetSettingsButton,
  SettingsButton,
  SwitchNetworkButton,
} from '../../buttons';

export enum ModalHeaderType {
  Main,
  Confirm,
  Sign,
  Sent,
  Failed,
  Slippage,
  GasPrice,
  SelectToken,
  AdvancedSettings,
  AddToken,
  Import,
  Custom,
  Route,
  Connection,
}

export interface BaseModalProps {
  headerType: ModalHeaderType;
  isOpen: boolean;
  closeModal?: () => void;
  goBack?: () => void;
  openSettings?: () => void;
  onReset?: () => void;
  children?: React.ReactNode;
  hide?: boolean;
  sx?: SxProps;
}

export const Modal = ({
  headerType,
  isOpen,
  closeModal,
  goBack,
  onReset,
  openSettings,
  children,
  hide,
  sx,
}: BaseModalProps) => {
  const { t } = useTranslation();
  const { account } = useWeb3React();

  const textModalType = {
    [ModalHeaderType.Main]: t('Swap'),
    [ModalHeaderType.Confirm]: t('Confirm swap'),
    [ModalHeaderType.Sign]: t('Sign transaction'),
    [ModalHeaderType.Sent]: t('Transaction sent'),
    [ModalHeaderType.Failed]: t('Transaction Failed'),
    [ModalHeaderType.Slippage]: t('Slippage'),
    [ModalHeaderType.GasPrice]: t('Gas price'),
    [ModalHeaderType.SelectToken]: t('Select a token'),
    [ModalHeaderType.AdvancedSettings]: t('Advanced settings'),
    [ModalHeaderType.AddToken]: t('Add a token'),
    [ModalHeaderType.Import]: t('Import a token'),
    [ModalHeaderType.Custom]: t('Custom tokens'),
    [ModalHeaderType.Route]: t('Routing'),
    [ModalHeaderType.Connection]: t('Connection'),
  };

  return isOpen ? (
    <Box
      sx={{
        ...sx,
        width: 'inherit',
        height: 'inherit',
        justifyContent: headerType === ModalHeaderType.AdvancedSettings ? 'flex-start' : 'space-between',
        flexDirection: 'column',
        display: hide ? 'none' : 'flex',
        // boxShadow: '0px 12px 24px #E2E9F6',
        borderRadius: '24px',
        position: 'absolute',
        bgcolor: 'widget.bg-main',
        zIndex: '1',
        padding:
          headerType === ModalHeaderType.SelectToken ||
          headerType === ModalHeaderType.AddToken ||
          headerType === ModalHeaderType.Custom ||
          headerType === ModalHeaderType.Route
            ? '11px 0'
            : '11px 16px 14px',
        boxSizing: 'border-box',
      }}>
      {headerType === ModalHeaderType.Main ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <SwitchNetworkButton />
          <Stack direction="row" alignItems="center">
            <RefreshQuoteButton />
            <SettingsButton onClick={openSettings} />
            {account && (
              <Box
                sx={{
                  p: '8px 10px',
                  bgcolor: 'widget.bg-01',
                  borderRadius: '16px',
                  typography: 'rm16',
                  color: 'widget.text-primary',
                }}>
                {`${account.slice(0, 6)}...${account.slice(account.length - 4)}`}
              </Box>
            )}
          </Stack>
        </Stack>
      ) : (
        <React.Fragment>
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '2.5em',
              m:
                headerType === ModalHeaderType.SelectToken ||
                headerType === ModalHeaderType.AddToken ||
                headerType === ModalHeaderType.Custom
                  ? '0 16px'
                  : '0 0 20px',
            }}>
            {goBack && (
              <Box
                sx={{
                  position: 'absolute',
                  top: -7,
                  left: headerType === ModalHeaderType.Route ? 19 : 0,
                }}>
                <BackButton onClick={goBack} />
              </Box>
            )}
            <Typography
              sx={{
                typography: 'mxlg20',
                width: headerType === ModalHeaderType.AdvancedSettings ? '60%' : '100%',
                lineHeight: 'normal',
                textAlign: 'center',
                color: 'widget.text-primary',
              }}>
              {textModalType[headerType]}
            </Typography>
            {closeModal && (
              <Box sx={{ position: 'absolute', right: -8, top: -5 }}>
                <CloseButton onClick={closeModal} />
              </Box>
            )}
            {onReset && (
              <Box sx={{ position: 'absolute', right: 0, top: 4 }}>
                <ResetSettingsButton onClick={onReset} />
              </Box>
            )}
          </Box>
        </React.Fragment>
      )}
      {children}
    </Box>
  ) : null;
};
