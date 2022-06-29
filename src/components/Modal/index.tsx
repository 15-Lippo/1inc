import { Box, InputAdornment, Stack, TextField, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { StyledComponent } from '@mui/styles';
import { SxProps } from '@mui/system';
import React from 'react';

import useActiveWeb3React from '../../hooks/useActiveWeb3React';
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
  Custom = 'Custom tokens',
}

interface ModalProps {
  headerType: ModalHeaderType;
  isOpen: boolean;
  closeModal?: () => void;
  goBack?: () => void;
  openSettings?: () => void;
  onSearch?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  searchValue?: string;
  children?: React.ReactNode;
  hide?: boolean;
  sx?: SxProps;
}

export const StyledSearchField: StyledComponent<any> = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    background: theme.palette.cool[100],
    '& ::placeholder': {
      opacity: 'none',
      color: '#3E4D63',
    },
    borderRadius: '12px',
    '& fieldset': {
      color: theme.palette.dark[900],
      borderRadius: '12px',
      borderColor: theme.palette.cool[100],
    },
    '&:hover fieldset': {
      borderColor: theme.palette.blue[500],
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.blue[500],
    },
  },
}));

export const Modal = ({
  headerType,
  isOpen,
  closeModal,
  goBack,
  onSearch,
  searchValue,
  openSettings,
  children,
  hide,
  sx,
}: ModalProps) => {
  const { account } = useActiveWeb3React();

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
        bgcolor: 'background.default',
        zIndex: '1',
        padding:
          headerType === ModalHeaderType.SelectToken ||
          headerType === ModalHeaderType.AddToken ||
          headerType === ModalHeaderType.Custom
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
        <React.Fragment>
          <Box
            sx={{
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
              <Box sx={{ position: 'absolute', top: 0 }}>
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
              <Box sx={{ right: '8px', position: 'absolute', top: 0 }}>
                <CloseButton onClick={closeModal} />
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
                value={searchValue}
                placeholder={searchFieldText[headerType]}
                onChange={onSearch}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <img
                        alt="svgImg"
                        src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHg9IjBweCIgeT0iMHB4Igp3aWR0aD0iMzAiIGhlaWdodD0iMzAiCnZpZXdCb3g9IjAgMCAxNzIgMTcyIgpzdHlsZT0iIGZpbGw6IzAwMDAwMDsiPjxnIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIGZvbnQtZmFtaWx5PSJub25lIiBmb250LXdlaWdodD0ibm9uZSIgZm9udC1zaXplPSJub25lIiB0ZXh0LWFuY2hvcj0ibm9uZSIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0wLDE3MnYtMTcyaDE3MnYxNzJ6IiBmaWxsPSJub25lIj48L3BhdGg+PGcgZmlsbD0iIzliYWZjZCI+PHBhdGggZD0iTTc0LjUzMzMzLDE3LjJjLTMxLjU5NjQyLDAgLTU3LjMzMzMzLDI1LjczNjkyIC01Ny4zMzMzMyw1Ny4zMzMzM2MwLDMxLjU5NjQyIDI1LjczNjkyLDU3LjMzMzMzIDU3LjMzMzMzLDU3LjMzMzMzYzEzLjczOTk4LDAgMjYuMzU4MzQsLTQuODc5MTUgMzYuMjQ3NjYsLTEyLjk3ODM5bDM0LjIzMjAzLDM0LjIzMjAzYzEuNDM4MDIsMS40OTc3OCAzLjU3MzQsMi4xMDExMyA1LjU4MjYsMS41NzczNWMyLjAwOTIsLTAuNTIzNzggMy41NzgyNiwtMi4wOTI4NCA0LjEwMjA0LC00LjEwMjA0YzAuNTIzNzgsLTIuMDA5MiAtMC4wNzk1NywtNC4xNDQ1OCAtMS41NzczNSwtNS41ODI2bC0zNC4yMzIwMywtMzQuMjMyMDNjOC4wOTkyNCwtOS44ODkzMiAxMi45NzgzOSwtMjIuNTA3NjggMTIuOTc4MzksLTM2LjI0NzY2YzAsLTMxLjU5NjQyIC0yNS43MzY5MiwtNTcuMzMzMzMgLTU3LjMzMzMzLC01Ny4zMzMzM3pNNzQuNTMzMzMsMjguNjY2NjdjMjUuMzk5MzcsMCA0NS44NjY2NywyMC40NjczIDQ1Ljg2NjY3LDQ1Ljg2NjY3YzAsMjUuMzk5MzcgLTIwLjQ2NzI5LDQ1Ljg2NjY3IC00NS44NjY2Nyw0NS44NjY2N2MtMjUuMzk5MzcsMCAtNDUuODY2NjcsLTIwLjQ2NzI5IC00NS44NjY2NywtNDUuODY2NjdjMCwtMjUuMzk5MzcgMjAuNDY3MywtNDUuODY2NjcgNDUuODY2NjcsLTQ1Ljg2NjY3eiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+"
                      />
                    </InputAdornment>
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
