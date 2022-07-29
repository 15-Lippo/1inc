import { Box, InputAdornment, Stack, Typography } from '@mui/material';
import { SxProps } from '@mui/system';
import React from 'react';

import { useActiveWeb3React } from '../../../packages/web3-provider';
import { BackButton, CloseButton, RefreshQuoteButton, ResetSettingsButton, SettingsButton } from '../../buttons';
import { StyledSearchField } from '../../fields';
import { SearchIcon } from '../../icons';

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
  Custom = 'Custom tokens',
  Route = 'Routing',
}

interface ModalProps {
  headerType: ModalHeaderType;
  isOpen: boolean;
  closeModal?: () => void;
  goBack?: () => void;
  openSettings?: () => void;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onReset?: () => void;
  searchValue?: string;
  children?: React.ReactNode;
  hide?: boolean;
  sx?: SxProps;
}

export const Modal = ({
  headerType,
  isOpen,
  closeModal,
  goBack,
  onSearch,
  onReset,
  searchValue,
  openSettings,
  children,
  hide,
  sx,
}: ModalProps) => {
  const { account } = useActiveWeb3React();
  const inputRef = React.useRef<HTMLInputElement>(null);

  const searchFieldText = {
    [ModalHeaderType.SelectToken]: 'Search by name or paste address',
    [ModalHeaderType.AddToken]: 'Search by address',
    [ModalHeaderType.Custom]: 'Search by name',
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
        boxShadow: '0px 12px 24px #E2E9F6',
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
          <Typography
            sx={{
              typography: 'sbm16',
              textAlign: 'center',
              color: 'widget.text-primary',
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
              alignItems: 'center',
              height: '2.5em',
              m:
                headerType === ModalHeaderType.SelectToken ||
                headerType === ModalHeaderType.AddToken ||
                headerType === ModalHeaderType.Custom
                  ? '0 16px'
                  : '0 0 20px',
            }}>
            {goBack && (
              <Box sx={{ position: 'absolute', top: -11 }}>
                <BackButton onClick={goBack} />
              </Box>
            )}
            <Typography
              sx={{
                typography: 'mxlg20',
                width: '100%',
                textAlign: 'center',
                color: 'widget.text-primary',
              }}>
              {headerType}
            </Typography>
            {closeModal && (
              <Box sx={{ position: 'absolute', right: -8, top: -9 }}>
                <CloseButton onClick={closeModal} />
              </Box>
            )}
            {onReset && (
              <Box sx={{ position: 'absolute', right: 0, top: 2 }}>
                <ResetSettingsButton onClick={onReset} />
              </Box>
            )}
          </Box>

          {headerType === ModalHeaderType.SelectToken ||
          headerType === ModalHeaderType.AddToken ||
          headerType === ModalHeaderType.Custom ? (
            <Box
              sx={{
                m: '0 16px',
              }}>
              <StyledSearchField
                id="search-token"
                variant="outlined"
                aria-label="search-token"
                type="search"
                autoComplete="off"
                value={searchValue}
                placeholder={searchFieldText[headerType]}
                onChange={onSearch}
                inputRef={inputRef}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <CloseButton
                      size="28"
                      onClick={() => {
                        if (inputRef.current) {
                          inputRef.current.value = '';
                        }
                      }}
                    />
                  ),
                }}
                margin="dense"
                fullWidth
              />
            </Box>
          ) : null}
        </React.Fragment>
      )}
      {children}
    </Box>
  ) : null;
};
