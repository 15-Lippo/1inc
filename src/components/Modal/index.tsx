import { Box, Stack, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import { useWeb3React } from '@web3-react/core';
import React from 'react';

import BackButton from '../Buttons/BackButton';
import CloseButton from '../Buttons/CloseButton';
import RefreshQuoteButton from '../Buttons/RefreshQuoteButton';

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
}

export interface ModalProps {
  headerType: ModalHeaderType;
  isOpen: boolean;
  closeModal?: () => void;
  goBack?: () => void;
  children?: React.ReactNode;
  hide?: boolean;
  sx?: SxProps;
}

const Modal = ({ headerType, isOpen, closeModal, goBack, children, hide, sx }: ModalProps) => {
  const { account } = useWeb3React();

  return isOpen ? (
    <Box
      sx={{
        ...sx,
        display: hide ? 'none' : '',
        boxShadow: '0px 12px 24px #E2E9F6',
        borderRadius: '24px',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        bgcolor: 'background.default',
        zIndex: '1',
        padding: headerType === ModalHeaderType.SelectToken ? '11px 0 14px' : '11px 16px 14px',
        boxSizing: 'border-box',
      }}>
      {headerType === ModalHeaderType.Main ? (
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          marginBottom="7px">
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
            m: headerType === ModalHeaderType.SelectToken ? '0 16px' : '',
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
