import { Box, Stack, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { useWeb3React } from '@web3-react/core';
import React from 'react';

import BackButton from '../Buttons/BackButton';
import CloseButton from '../Buttons/CloseButton';
import RefreshQuoteButton from '../Buttons/RefreshQuoteButton';
import SettingsButton from '../Buttons/SettingsButton';

export enum ModalHeaderType {
  Main = 'Swap',
  Confirm = 'Confirm swap',
  Sign = 'Sign transaction',
  Sent = 'Transaction sent',
  Failed = 'Transaction Failed',
  Slippage = 'Slippage',
  GasPrice = 'Gas price',
  SelectToken = 'Select a token',
  AdvancedSettings = 'Advanced settings',
  AddToken = 'Add a token',
  Import = 'Import a token',
}

export interface ModalProps {
  headerType: ModalHeaderType;
  isOpen: boolean;
  closeModal?: () => void;
  goBack?: () => void;
  openSettings?: () => void;
  children?: React.ReactNode;
  hide?: boolean;
  sx?: SxProps;
}

const Modal = ({
  headerType,
  isOpen,
  closeModal,
  goBack,
  openSettings,
  children,
  hide,
  sx,
}: ModalProps) => {
  const { account } = useWeb3React();

  return isOpen ? (
    <Box
      sx={{
        ...sx,
        width: 'inherit',
        height: 'inherit',
        justifyContent:
          headerType === ModalHeaderType.AdvancedSettings ? 'flex-start' : 'space-between',
        flexDirection: 'column',
        display: hide ? 'none' : 'flex',
        boxShadow: '0px 12px 24px #E2E9F6',
        borderRadius: '24px',
        position: 'absolute',
        bgcolor: 'background.default',
        zIndex: '1',
        padding:
          headerType === ModalHeaderType.SelectToken || headerType === ModalHeaderType.AddToken
            ? '11px 0'
            : '11px 16px 14px',
        boxSizing: 'border-box',
      }}>
      {headerType === ModalHeaderType.Main ? (
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography
            sx={{
              typography: 'sbm16',
              textAlign: 'center',
              color: 'dark.900',
            }}>
            {headerType}
          </Typography>
          <Stack direction="row" alignItems="center">
            <RefreshQuoteButton />
            <SettingsButton onClick={openSettings} />
            {account && (
              <Box
                sx={{
                  p: '8px 10px',
                  bgcolor: 'cool.100',
                  borderRadius: '16px',
                  typography: 'rm16',
                }}>
                {`${account.slice(0, 6)}...${account.slice(account.length - 4)}`}
              </Box>
            )}
          </Stack>
        </Stack>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            height: '2.5em',
            m:
              headerType === ModalHeaderType.SelectToken || headerType === ModalHeaderType.AddToken
                ? '0 16px'
                : '0 0 20px',
          }}>
          {goBack && (
            <Box sx={{ position: 'absolute' }}>
              <BackButton onClick={goBack} />
            </Box>
          )}
          <Typography
            sx={{
              typography: 'mxlg20',
              width: '100%',
              textAlign: 'center',
              color: 'dark.900',
            }}>
            {headerType}
          </Typography>
          {closeModal && (
            <Box sx={{ right: '8px', position: 'absolute' }}>
              <CloseButton onClick={closeModal} />
            </Box>
          )}
        </Box>
      )}
      {children}
    </Box>
  ) : null;
};

export default Modal;
